"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";

type Result = { ok: true } | { ok: false; error: string };

/**
 * Sesión del admin en el navegador. La interfaz de edición se muestra con cualquier sesión;
 * quien decide si se puede escribir es la Server Action, que verifica el token.
 */
export default function useAdmin() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (!auth) return;
        return onAuthStateChanged(auth, setUser);
    }, []);

    /** Ejecuta una Server Action con el token actual y recarga los datos del servidor. */
    const act = useCallback(async (action: (idToken: string) => Promise<Result>) => {
        if (!user) return false;
        setBusy(true);
        try {
            const result = await action(await user.getIdToken());
            if (!result.ok) {
                window.alert(`No se pudo guardar: ${result.error}`);
                return false;
            }
            router.refresh();
            return true;
        } finally {
            setBusy(false);
        }
    }, [user, router]);

    return { user, busy, act };
}
