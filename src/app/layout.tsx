import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Providers from "./providers";

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
    {
        text: "Categorias",
        href: "/categorias",
    },
    {
        text: "Proveedores",
        href: "/proveedores",
    },
];

function Navbar() {
    return (
        <nav className="w-full h-full shadow-md flex flex-col justify-start">
            <div className="w-full h-16 flex items-end">
                <Link className="flex w-full p-2 rounded-md text-sm" href="">
                    icon
                </Link>
            </div>

            <div className="space-y-2">
                {rutas.map((r) => {
                    return (
                        <div className="flex items-center px-4">
                            <Link
                                key={r.text}
                                className="flex w-full p-2 rounded-md text-sm hover:bg-neutral hover:text-neutral-content transition duration-100 ease-out font-semibold"
                                href={r.href}
                            >
                                {r.text}
                            </Link>
                        </div>
                    );
                })}
            </div>
        </nav>
    );
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" data-theme="corporate">
            <body className={inter.className + " flex min-h-dvh"}>
                <Providers>
                    <aside className="w-48">
                        <Navbar />
                    </aside>

                    <div className="h-full flex-grow flex-shrink-0 pt-6">{children}</div>
                </Providers>
            </body>
        </html>
    );
}
