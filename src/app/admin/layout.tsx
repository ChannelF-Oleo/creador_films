import type { Metadata } from "next";

// El panel no debe indexarse aunque alguien enlace a él (robots.txt solo bloquea el rastreo)
export const metadata: Metadata = {
    title: "Admin",
    robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return children;
}
