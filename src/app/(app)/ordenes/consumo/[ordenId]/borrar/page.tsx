import ResponsiveLayout, { LinkAction } from "@/components/layouts/ResponsiveLayout";
import { findOrdenConsumo, isOrdenConsumoUsed } from "@/lib/queries";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import BorrarForm from "./BorrarForm";
import { borrarOrdenConsumo } from "./action";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

export const metadata: Metadata = {
    title: "Borrar Orden de consumo",
};

export function bindOrdenConsumoId(ordenConsumoId: number) {
    return borrarOrdenConsumo.bind(null, ordenConsumoId);
}

export default async function Page({ params }: { params: { ordenId: number } }) {
    const orden = await findOrdenConsumo(params.ordenId);

    if (!orden) {
        return notFound();
    }

    const borrarOrdenConsumoWithId = bindOrdenConsumoId(orden.id);

    return (
        <ResponsiveLayout
            title="Borrar Orden de Consumo"
            acciones={() => {
                return <LinkAction href="/ordenes/consumo">Volver</LinkAction>;
            }}
        >
            <section className="w-full justify-center flex">
                <div className="card w-1/2 shadow-lg">
                    <BorrarForm orden={orden} onSubmit={borrarOrdenConsumoWithId} />
                </div>
            </section>
        </ResponsiveLayout>
    );
}
