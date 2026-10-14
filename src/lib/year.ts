import "server-only";

import { cacheLife } from "next/cache";

/** Año del copyright. Con cacheComponents la hora no puede leerse durante el prerender sin caché. */
export async function getCurrentYear() {
    "use cache";
    cacheLife("days");
    return new Date().getFullYear();
}
