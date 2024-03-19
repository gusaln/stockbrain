import ResponsiveLayout, { LinkAction } from "@/components/layouts/ResponsiveLayout";
import { findOrdenCompra, isOrdenCompraUsed } from "@/lib/queries";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import BorrarForm from "./BorrarForm";
import { borrarOrdenCompra } from "./action";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

export const metadata: Metadata = {
    title: "Borrar Orden de compra",
};

export function bindOrdenCompraId(ordenCompraId: number) {
    return borrarOrdenCompra.bind(null, ordenCompraId);
}

export default async function Page({ params }: { params: { ordenId: number } }) {
    const orden = await findOrdenCompra(params.ordenId);

    if (!orden) {
        return notFound();
    }

    const borrarOrdenCompraWithId = bindOrdenCompraId(orden.id);

    return (
        <ResponsiveLayout
            title="Borrar Orden de Compra"
            acciones={() => {
                return <LinkAction href="/ordenes/compra">Volver</LinkAction>;
            }}
        >
            <section className="w-full justify-center flex">
                <div className="card w-1/2 shadow-lg">
                    <BorrarForm orden={orden} onSubmit={borrarOrdenCompraWithId} />
                </div>
            </section>
        </ResponsiveLayout>
    );
}
