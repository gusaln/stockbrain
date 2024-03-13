import ResponsiveLayout, { LinkAction } from "@/components/layouts/ResponsiveLayout";
import { findCategoria } from "@/lib/queries";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import EditarForm from "./EditarForm";
import { editarCategoria } from "./action";

export const metadata: Metadata = {
    title: "Editar categoría",
};

export function bindCategoriaId(categoriaId: number) {
    return editarCategoria.bind(null, categoriaId);
}

export default async function Page({ params }: { params: { categoriaId: number } }) {
    const categoria = await findCategoria(params.categoriaId);

    if (!categoria) {
        return notFound();
    }

    const editarCategoriaWithId = bindCategoriaId(categoria.id);

    return (
        <ResponsiveLayout
            title="Editar Categoría"
            acciones={() => {
                return <LinkAction href="/admin/categorias">Volver</LinkAction>;
            }}
        >
            <section className="w-full justify-center flex">
                <div className="card w-1/2 shadow-lg">
                    <EditarForm categoria={categoria} onSubmit={editarCategoriaWithId} />
                </div>
            </section>
        </ResponsiveLayout>
    );
}
