import ResponsiveLayout, { LinkAction } from "@/components/layouts/ResponsiveLayout";
import { findOrdenCompra } from "@/lib/queries";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import BorrarForm from "./BorrarForm";
import { borrarOrdenCompra } from "./action";

export const metadata: Metadata = {
    title: "Borrar Transferencia",
};

export function bindBorrarTransferencia(transferenciaId: number) {
    return borrarOrdenCompra.bind(null, transferenciaId);
}

export default async function Page({ params }: { params: { transferenciaId: number } }) {
    const transferencia = await findOrdenCompra(params.transferenciaId);

    if (!transferencia) {
        return notFound();
    }

    const borrarTransferenciaWithId = bindBorrarTransferencia(transferencia.id);

    return (
        <ResponsiveLayout
            title="Borrar Transferencia"
            acciones={() => {
                return <LinkAction href="/transferencias">Volver</LinkAction>;
            }}
        >
            <section className="w-full justify-center flex">
                <div className="card w-1/2 shadow-lg">
                    <BorrarForm transferencia={transferencia} onSubmit={borrarTransferenciaWithId} />
                </div>
            </section>
        </ResponsiveLayout>
    );
}
