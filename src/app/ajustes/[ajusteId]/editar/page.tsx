import ResponsiveLayout, { LinkAction } from "@/components/layouts/ResponsiveLayout";
import { findAjusteInventario } from "@/lib/queries";
import { findAlmacen } from "@/lib/queries";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import EditarForm from "./EditarForm";
import { editarAjuste } from "./action";

export const metadata: Metadata = {
    title: "Editar Ajuste",
};

export function bindAjusteId(ajusteId: number) {
    return editarAjuste.bind(null, ajusteId);
}

export default async function Page({ params }: { params: { ajusteId: number } }) {
    const ajuste = await findAjusteInventario(params.ajusteId);
    const almacen = await findAlmacen();


    if (!ajuste || !almacen) {
        return notFound();
    }

    const editarAjusteWithId = bindAjusteId(ajuste.id);

    return (
        <ResponsiveLayout
            title="Editar Ajuste"
            acciones={() => {
                return <LinkAction href="/ajustes">Volver</LinkAction>;
            }}
        >
            <section className="w-full justify-center flex">
                <div className="card w-fit shadow-lg">
                    <EditarForm ajuste={ajuste} almacenes={almacen} onSubmit={editarAjusteWithId} />
                </div>
            </section>
        </ResponsiveLayout>
    );
}
