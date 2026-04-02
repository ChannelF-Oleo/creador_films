import imageCompression from "browser-image-compression";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { storage, db } from "@/lib/firebase";

interface UploadParams {
    file: File;
    category: string;
    description?: string;
}

export const uploadImageWithCompression = async ({ file, category, description = "" }: UploadParams) => {
    try {
        // 1. Opciones de compresión
        const options = {
            maxSizeMB: 1,            // Tamaño máximo de 1MB
            maxWidthOrHeight: 1920, // Resolución máxima Full HD
            useWebWorker: true,     // Usa hilos secundarios para no bloquear la interfaz
        };

        // 2. Ejecutar compresión
        console.log("Comprimiendo imagen...");
        const compressedFile = await imageCompression(file, options);

        // 3. Crear referencia en Firebase Storage
        // Usamos un timestamp para evitar colisiones de nombres
        const fileName = `${Date.now()}-${compressedFile.name}`;
        const storageRef = ref(storage, `portafolio/${fileName}`);

        // 4. Subir el archivo comprimido
        const snapshot = await uploadBytes(storageRef, compressedFile);
        const downloadURL = await getDownloadURL(snapshot.ref);

        // 5. Guardar metadatos en Firestore
        // Esto es lo que leerá tu componente Gallery.tsx
        const docRef = await addDoc(collection(db, "photos"), {
            src: downloadURL,
            alt: description || `Fotografía de ${category}`,
            cat: category,
            createdAt: new Date(),
            // Puedes añadir propiedades de estilo si lo deseas
            tall: false,
            wide: false
        });

        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error en la subida:", error);
        throw error;
    }
};
