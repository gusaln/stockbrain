import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "StockBrain",
    description: "",
};

const rutas = [
    {
        text: "Dashboard",
        href: "/",
    },
    {
        text: "Usuarios",
        href: "/usuarios",
    },
];

function Navbar() {
    return (
        <nav className="w-full h-full shadow-md flex flex-col justify-start">
            {rutas.map((r) => {
                return (
                    <Link key={r.text} className="flex items-center justify-center h-12" href={r.href}>
                        {r.text}
                    </Link>
                );
            })}
        </nav>
    );
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className + " flex h-dvh"}>
                <aside className="w-80 h-full ">
                    <Navbar />
                </aside>

                <div className="h-full flex-grow flex-shrink-0">{children}</div>
            </body>
        </html>
    );
}
