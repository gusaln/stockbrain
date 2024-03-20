import ResponsiveLayout, { LinkAction } from "@/components/layouts/ResponsiveLayout";
import { getAlmacenes, getProductos } from "@/lib/queries";
import { findTransferencia } from "@/lib/queries/transferencias";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import EditarForm from "./EditarForm";
import { editarTransferencia } from "./action";

export const metadata: Metadata = {
    title: "Editar Transferencia",
};

export function bindEditarTransferencia(transferenciaId: number) {
    return editarTransferencia.bind(null, transferenciaId);
}

export default async function Page({ params }: { params: { transferenciaId: number } }) {
    const transferencia = await findTransferencia(params.transferenciaId);
    const almacenes = (await getAlmacenes(undefined, { limit: 100 })).data;
    const productos = (await getProductos(undefined, { page: 1, limit: 100 })).data;

    if (!transferencia) {
        return notFound();
    }

    const editarTransferenciaWithId = bindEditarTransferencia(transferencia.id);

    return (
        <ResponsiveLayout
            title="Editar transferencia"
            acciones={() => {
                return <LinkAction href="/transferencias">Volver</LinkAction>;
            }}
        >
            <section className="w-full justify-center flex">
                <div className="card w-full shadow-lg">
                    <EditarForm
                        transferencia={transferencia}
                        almacenes={almacenes}
                        productos={productos}
                        onSubmit={editarTransferenciaWithId}
                    />
                </div>
            </section>
        </ResponsiveLayout>
    );
}
