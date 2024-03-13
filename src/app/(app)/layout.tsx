import { Loader } from "@/components/Loader";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import Providers from "../providers";
import { authenticate } from "@/lib/auth";
import { ROL } from "@/lib/queries";
import { logout } from "../(auth)/actions";

const rutas = [
    {
        text: "Dashboard",
        href: "/",
    },
    {
        text: "Productos",
        href: "/productos",
    },
    {
        text: "Proveedores",
        href: "/proveedores",
    },
    {
        text: "Ordenes de compra",
        href: "/ordenes/compra",
    },
    {
        text: "Ordenes de consumo",
        href: "/ordenes/consumo",
    },
    {
        text: "Ajustes de Inventario",
        href: "/ajustes",
    },
    {
        text: "Movimientos",
        href: "/movimientos",
    },
];

const rutasAdmin = [
    {
        text: "Usuarios",
        href: "/admin/usuarios",
    },
    {
        text: "Categorias",
        href: "/admin/categorias",
    },
];

function Navbar({ esAdmin }: { esAdmin?: boolean }) {
    return (
        <nav className="w-full h-full shadow-md flex flex-col justify-start px-4">
            <div className="w-full h-16 flex items-end">
                <Link className="flex w-full p-2 rounded-md text-sm" href="">
                    <Image alt="icon" src="/Lida-Logo.svg" width={50} height={50} className="rounded-lg" />
                </Link>
            </div>

            <div className="space-y-2">
                {rutas.map((r) => {
                    return (
                        <div className="flex items-center" key={r.text}>
                            <Link
                                className="flex w-full p-2 rounded-md text-sm hover:bg-neutral hover:text-neutral-content transition duration-100 ease-out font-semibold"
                                href={r.href}
                            >
                                {r.text}
                            </Link>
                        </div>
                    );
                })}
            </div>

            {esAdmin ? (
                <div className="space-y-2 border-t border-t-gray-200 pt-6 mt-6">
                    {rutasAdmin.map((r) => {
                        return (
                            <div className="flex items-center" key={r.text}>
                                <Link
                                    className="flex w-full p-2 rounded-md text-sm hover:bg-neutral hover:text-neutral-content transition duration-100 ease-out font-semibold"
                                    href={r.href}
                                >
                                    {r.text}
                                </Link>
                            </div>
                        );
                    })}
                </div>
            ) : undefined}
        </nav>
    );
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await authenticate();

    return (
        <Providers>
            <div className="flex min-h-dvh">
                <aside className="w-48">
                    <Navbar esAdmin={user?.rol == ROL.administrador} />
                </aside>

                <div className="h-full flex-grow flex-shrink-0 pt-6">
                    <header className="w-full h-12 shadow-sm mb-8">
                        <div className="w-11/12 flex items-center justify-end mx-auto space-x-4">
                            <span className="font-medium"> Hola {user?.nombre}</span>

                            <form action={logout} method="POST">
                                <button className="btn btn-sm ">Salir</button>
                            </form>
                        </div>
                    </header>

                    <Suspense fallback={<Loader />}>{children}</Suspense>
                </div>
            </div>
        </Providers>
    );
}
