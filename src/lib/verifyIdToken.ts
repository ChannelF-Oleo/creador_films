import "server-only";

import { createRemoteJWKSet, jwtVerify } from "jose";

// Claves públicas con las que Firebase Auth firma los ID tokens
const FIREBASE_JWKS = createRemoteJWKSet(
    new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
);

/**
 * Verifica un ID token de Firebase Auth y devuelve el UID.
 * Sustituye a firebase-admin/auth: en Vercel ese módulo no carga (ERR_REQUIRE_ESM con jose)
 * y rompía tanto las acciones como las lecturas de Firestore que compartían el import.
 */
export async function verifyIdToken(idToken: string): Promise<string> {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    if (!projectId) throw new Error("Falta FIREBASE_PROJECT_ID");

    const { payload } = await jwtVerify(idToken, FIREBASE_JWKS, {
        algorithms: ["RS256"],
        issuer: `https://securetoken.google.com/${projectId}`,
        audience: projectId,
    });
    if (!payload.sub) throw new Error("Token sin usuario");
    return payload.sub;
}
