"use client";

import { useEffect, useState } from "react";
import { auth, db, storage } from "@/lib/firebase";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";
import { createCategory, createPhoto, moveCategory } from "@/app/actions/admin";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // states for UI
  const [activeTab, setActiveTab] = useState<"photo" | "category">("photo");

  // states for Category
  const [categoryName, setCategoryName] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categorySuccess, setCategorySuccess] = useState("");

  // states for Photo

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoCategory, setPhotoCategory] = useState("");
  const [photoAlt, setPhotoAlt] = useState("");
  const [categories, setCategories] = useState<{ id: string, name: string, order: number }[]>([]);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoProgress, setPhotoProgress] = useState(0);
  const [photoSuccess, setPhotoSuccess] = useState("");

  // Check auth
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        // Redirigir al login si no hay usuario (puedes crear esta ruta después si no existe)
        router.push("/admin/login");
      } else {
        setUser(currentUser);
        setLoading(false);
        fetchCategories();
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const cats: { id: string, name: string, order: number }[] = [];
      querySnapshot.forEach((doc) => {
        cats.push({ id: doc.id, name: doc.data().name, order: doc.data().order ?? Number.MAX_SAFE_INTEGER });
      });
      // Mismo orden que los filtros del portafolio
      setCategories(cats.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name)));
    } catch (error) {
      console.error("Error fetching categories: ", error);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim() || !user) return;

    setCategoryLoading(true);
    setCategorySuccess("");
    try {
      // El servidor quita espacios sobrantes y rechaza nombres repetidos
      const result = await createCategory(await user.getIdToken(), categoryName);
      if (!result.ok) {
        setCategorySuccess(`Error: ${result.error}`);
        return;
      }
      setCategorySuccess("Categoría creada exitosamente.");
      setCategoryName("");
      fetchCategories(); // Reload categories
    } catch (error) {
      console.error("Error creating category:", error);
      setCategorySuccess("Error al crear categoría.");
    } finally {
      setCategoryLoading(false);
      setTimeout(() => setCategorySuccess(""), 3000);
    }
  };

  const handleMoveCategory = async (categoryId: string, direction: -1 | 1) => {
    if (!user) return;
    setCategoryLoading(true);
    try {
      const result = await moveCategory(await user.getIdToken(), categoryId, direction);
      if (!result.ok) setCategorySuccess(`Error: ${result.error}`);
      await fetchCategories();
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleUploadPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoFile || !photoCategory || !user) return;

    setPhotoLoading(true);
    setPhotoProgress(0);
    setPhotoSuccess("");

    try {
      // 1. Comprimir imagen
      const options = {
        maxSizeMB: 3,
        maxWidthOrHeight: 2400,
        initialQuality: 0.85,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(photoFile, options);

      // Medidas reales para que el portafolio muestre la foto sin recortes
      const bitmap = await createImageBitmap(compressedFile);
      const { width, height } = bitmap;
      bitmap.close();

      // 2. Subir a Firebase Storage
      const storagePath = `portfolio/${Date.now()}_${compressedFile.name}`;
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, compressedFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setPhotoProgress(progress);
        },
        (error) => {
          console.error("Upload error:", error);
          setPhotoSuccess("Error al subir imagen.");
          setPhotoLoading(false);
        },
        async () => {
          // 3. Guardar en Firestore desde el servidor, que además refresca el portafolio
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const result = await createPhoto(await user.getIdToken(), {
            src: downloadURL,
            storagePath,
            categoryId: photoCategory,
            alt: photoAlt,
            width,
            height,
          });
          if (!result.ok) {
            setPhotoSuccess(`Error al guardar la foto: ${result.error}`);
            setPhotoLoading(false);
            return;
          }

          setPhotoSuccess("Foto subida exitosamente.");
          setPhotoFile(null);
          setPhotoAlt("");
          setPhotoLoading(false);
          setPhotoProgress(0);
          
          setTimeout(() => setPhotoSuccess(""), 3000);
        }
      );

    } catch (error) {
      console.error("Compression or upload process failed:", error);
      setPhotoSuccess("Error al procesar la imagen.");
      setPhotoLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        <p className="font-serif italic text-xl tracking-widest animate-pulse">Cargando...</p>
      </div>
    );
  }

  if (!auth) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-white text-center">
        <h1 className="text-3xl font-serif italic text-red-500 mb-4">Error de Configuración</h1>
        <p className="max-w-md text-sm text-gray-400 tracking-wider">
          Faltan las variables de entorno de Firebase. Asegúrate de configurar tu archivo <code className="text-white">.env.local</code> con las claves de Firebase necesarias para que el sistema de administrador funcione.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 p-6 sm:p-12 font-sans selection:bg-white selection:text-black">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-end border-b border-white/10 pb-6 mb-12">
          <div>
            <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-tighter text-white">Dashboard</h1>
            <p className="text-gray-500 text-sm tracking-widest mt-2 uppercase">Gestor de Contenido / Creador Films</p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <Link
              href="/portafolio"
              className="text-xs uppercase tracking-widest text-white hover:text-gray-300 transition-colors duration-300"
            >
              Editar portafolio y landing →
            </Link>
            <button
              onClick={() => signOut(auth)}
              className="text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors duration-300"
            >
              Cerrar Sesión
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex gap-8 mb-12 border-b border-white/10">
          <button
            onClick={() => setActiveTab("photo")}
            className={`pb-4 uppercase tracking-widest text-sm transition-all duration-300 ${activeTab === 'photo' ? 'text-white border-b-2 border-white' : 'text-gray-600 hover:text-gray-300'}`}
          >
            Subir Fotografía
          </button>
          <button
            onClick={() => setActiveTab("category")}
            className={`pb-4 uppercase tracking-widest text-sm transition-all duration-300 ${activeTab === 'category' ? 'text-white border-b-2 border-white' : 'text-gray-600 hover:text-gray-300'}`}
          >
            Categorías
          </button>
        </div>

        {/* Dynamic Content */}
        <div className="bg-[#0a0a0a] border border-white/5 p-8 sm:p-12 rounded-xl backdrop-blur-sm shadow-2xl relative overflow-hidden">
          {/* Subtle glow effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>

          {/* ---- TAB: SUBIR FOTO ---- */}
          {activeTab === "photo" && (
            <div className="animate-fade-in relative z-10">
              <h2 className="text-2xl text-white font-serif italic mb-8">Nueva Obra</h2>
              
              <form onSubmit={handleUploadPhoto} className="space-y-6">

                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Categoría</label>
                  {categories.length === 0 ? (
                    <p className="text-red-400 text-xs italic">Crea una categoría primero.</p>
                  ) : (
                    <select
                      value={photoCategory}
                      onChange={(e) => setPhotoCategory(e.target.value)}
                      required
                      className="w-full bg-[#0a0a0a] border-b border-white/20 pb-2 text-white focus:outline-none focus:border-white transition-colors duration-300 appearance-none"
                    >
                      <option value="" disabled>Selecciona una categoría</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Archivo Imagen</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-white/10 border-dashed rounded-lg hover:border-white/30 transition-colors duration-300 cursor-pointer">
                    <div className="space-y-1 text-center w-full">
                      <svg className="mx-auto h-8 w-8 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-400 justify-center">
                        <label className="relative cursor-pointer rounded-md font-medium text-white hover:text-gray-300 focus-within:outline-none">
                          <span className="uppercase tracking-widest text-xs">Subir archivo</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="sr-only" 
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setPhotoFile(e.target.files[0]);
                              }
                            }}
                            required 
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 uppercase">PNG, JPG, WEBP hasta 10MB</p>
                      {photoFile && <p className="text-sm text-green-400 mt-2 font-mono">{photoFile.name}</p>}
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="photo-alt" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Texto alternativo</label>
                  <input
                    id="photo-alt"
                    type="text"
                    value={photoAlt}
                    onChange={(e) => setPhotoAlt(e.target.value)}
                    className="w-full bg-transparent border-b border-white/20 pb-2 text-white focus:outline-none focus:border-white transition-colors duration-300"
                    placeholder="Ej. Retrato en blanco y negro en un callejón de Santo Domingo"
                  />
                  <p className="text-xs text-gray-600 mt-2">Describe la foto para Google y lectores de pantalla. Si lo dejas vacío se usa el nombre de la categoría.</p>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={photoLoading || categories.length === 0}
                    className="w-full bg-white text-black py-4 uppercase tracking-widest text-sm font-bold hover:bg-gray-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3"
                  >
                    {photoLoading ? `Subiendo... ${photoProgress.toFixed(0)}%` : "Publicar Fotografía"}
                  </button>
                </div>
                
                {photoSuccess && (
                  <p className={`text-sm mt-4 uppercase tracking-widest text-center ${photoSuccess.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
                    {photoSuccess}
                  </p>
                )}
              </form>
            </div>
          )}

          {/* ---- TAB: CREAR CATEGORIA ---- */}
          {activeTab === "category" && (
            <div className="animate-fade-in relative z-10">
              <h2 className="text-2xl text-white font-serif italic mb-8">Administrar Categorías</h2>
              
              <form onSubmit={handleCreateCategory} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Nombre de la Categoría</label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                    className="w-full bg-transparent border-b border-white/20 pb-2 text-white focus:outline-none focus:border-white transition-colors duration-300"
                    placeholder="Ej. Retratos Urbanos"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={categoryLoading}
                    className="w-full bg-transparent border border-white text-white py-4 uppercase tracking-widest text-sm font-bold hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {categoryLoading ? "Creando..." : "Crear Categoría"}
                  </button>
                </div>

                {categorySuccess && (
                  <p className={`text-sm mt-4 uppercase tracking-widest text-center ${categorySuccess.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
                    {categorySuccess}
                  </p>
                )}
              </form>

              {/* Listado de categorías */}
              <div className="mt-12">
                <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-1">Categorías Existentes</h3>
                <p className="text-xs text-gray-600 mb-4">Este es el orden de los filtros del portafolio.</p>
                <ul className="space-y-2">
                  {categories.map((cat, i) => (
                    <li key={cat.id} className="flex items-center gap-3 text-sm text-gray-300 border-b border-white/5 pb-2">
                      <span className="w-1.5 h-1.5 bg-white/20 rounded-full"></span>
                      <span className="flex-1">{cat.name}</span>
                      <button
                        type="button"
                        onClick={() => handleMoveCategory(cat.id, -1)}
                        disabled={categoryLoading || i === 0}
                        className="px-2 text-gray-500 hover:text-white disabled:opacity-20"
                        aria-label={`Subir ${cat.name}`}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveCategory(cat.id, 1)}
                        disabled={categoryLoading || i === categories.length - 1}
                        className="px-2 text-gray-500 hover:text-white disabled:opacity-20"
                        aria-label={`Bajar ${cat.name}`}
                      >
                        ↓
                      </button>
                    </li>
                  ))}
                  {categories.length === 0 && <p className="text-gray-600 text-sm italic">No hay categorías. Crea una.</p>}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
