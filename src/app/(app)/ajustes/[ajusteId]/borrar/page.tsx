import ResponsiveLayout, { LinkAction } from "@/components/layouts/ResponsiveLayout";
import { findTransferencia } from "@/lib/queries/transferencias";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import BorrarForm from "./BorrarForm";
import { borrarAjuste } from "./action";
import { findAjusteInventario } from "@/lib/queries";

export const metadata: Metadata = {
    title: "Borrar Transferencia",
};

export function bindBorrarTransferencia(ajusteId: number) {
    return borrarAjuste.bind(null, ajusteId);
}

export default async function Page({ params }: { params: { ajusteId: number } }) {
    const ajuste = await findAjusteInventario(params.ajusteId);

    if (!ajuste) {
        return notFound();
    }

    const borrarAjusteWithId = bindBorrarTransferencia(ajuste.id);

    return (
        <ResponsiveLayout
            title="Borrar ajuste"
            acciones={() => {
                return <LinkAction href="/ajustes">Volver</LinkAction>;
            }}
        >
            <section className="w-full justify-center flex">
                <div className="card w-1/2 shadow-lg">
                    <BorrarForm ajuste={ajuste} onSubmit={borrarAjusteWithId} />
                </div>
            </section>
        </ResponsiveLayout>
    );
}
