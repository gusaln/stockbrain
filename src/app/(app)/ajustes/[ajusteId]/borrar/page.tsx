import ResponsiveLayout, { LinkAction } from "@/components/layouts/ResponsiveLayout";
import { findTransferencia } from "@/lib/queries/transferencias";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import BorrarForm from "./BorrarForm";
import { borrarAjuste } from "./action";

export const metadata: Metadata = {
    title: "Borrar Transferencia",
};

export function bindBorrarTransferencia(transferenciaId: number) {
    return borrarAjuste.bind(null, transferenciaId);
}

export default async function Page({ params }: { params: { transferenciaId: number } }) {
    const transferencia = await findTransferencia(params.transferenciaId);

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
