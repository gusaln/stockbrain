import ResponsiveLayout, { LinkAction } from "@/components/layouts/ResponsiveLayout";
import { findCategoria, findProducto, getCategorias } from "@/lib/queries";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import EditarForm from "./EditarForm";
import { editarProducto } from "./action";

export const metadata: Metadata = {
    title: "Editar producto",
};

export function bindProductoId(productoId: number) {
    return editarProducto.bind(null, productoId);
}

export default async function Page({ params }: { params: { productoId: number } }) {
    const producto = await findProducto(params.productoId);
    
    if (!producto) {
        return notFound();
    }
    
    const categorias = (await getCategorias(undefined, {page: 1, limit: 100})).data

    const editarProductoWithId = bindProductoId(producto.id);

    return (
        <ResponsiveLayout
            title="Editar Producto"
            acciones={() => {
                return <LinkAction href="/productos">Volver</LinkAction>;
            }}
        >
            <section className="w-full justify-center flex">
                <div className="card w-fit shadow-lg">
                    <EditarForm producto={producto} categorias={categorias} onSubmit={editarProductoWithId} />
                </div>
            </section>
        </ResponsiveLayout>
    );
}
