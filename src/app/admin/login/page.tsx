"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/admin/dashboard");
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigningIn(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Let the onAuthStateChanged effect handle the redirect
    } catch (err: any) {
      console.error(err);
      setError("Credenciales incorrectas. Verifica tu correo y contraseña.");
      setSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <p className="font-serif italic text-xl tracking-widest animate-pulse">Cargando...</p>
      </div>
    );
  }

  if (!auth) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-white text-center">
        <h1 className="text-3xl font-serif italic text-red-500 mb-4">Error de Configuración</h1>
        <p className="max-w-md text-sm text-gray-400 tracking-wider">
          Faltan las variables de entorno de Firebase. Asegúrate de configurar tu archivo <code className="text-white">.env.local</code> con las claves de Firebase necesarias para acceder.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-200 flex flex-col items-center justify-center p-6 selection:bg-white selection:text-black">
      {/* Background aesthetics */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] sm:w-[40vw] sm:h-[40vw] bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#050505] border border-white/10 p-10 sm:p-14 rounded-2xl backdrop-blur-xl relative z-10 shadow-2xl">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-serif italic text-white mb-2">Acceso Fotógrafo</h1>
          <div className="w-12 h-px bg-white/30 mx-auto mt-4"></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div>
            <label className="block text-[0.65rem] uppercase tracking-[0.2em] text-gray-500 mb-3">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-white/20 pb-3 text-white text-sm focus:outline-none focus:border-white transition-colors duration-500 placeholder-white/10"
              placeholder="fotografo@creadorfilms.com"
              required
            />
          </div>

          <div>
            <label className="block text-[0.65rem] uppercase tracking-[0.2em] text-gray-500 mb-3">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-white/20 pb-3 text-white text-sm focus:outline-none focus:border-white transition-colors duration-500 placeholder-white/10"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs italic text-center tracking-wide">{error}</p>
          )}

          <div className="pt-6">
            <button
              type="submit"
              disabled={signingIn}
              className="w-full bg-white text-black py-4 uppercase tracking-[0.15em] text-[0.75rem] font-bold hover:bg-[#e0e0e0] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              <span className="relative z-10">{signingIn ? "Verificando..." : "Entrar"}</span>
            </button>
          </div>
          
          <div className="pt-2 text-center">
            <a href="/" className="inline-block text-[0.65rem] uppercase tracking-[0.2em] text-gray-600 hover:text-white transition-colors duration-300">
              Volver al inicio
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
