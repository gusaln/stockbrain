import ResponsiveLayout, { LinkAction } from "@/components/layouts/ResponsiveLayout";
import { findOrdenConsumo, getAlmacenes, getOrdenConsumoItems, getProductos } from "@/lib/queries";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import CrearItemForm from "./CrearItemForm";
import EditarForm from "./EditarForm";
import EditarItemForm from "./EditarItemForm";
import { borrarOrdenConsumoItem, crearOrdenConsumoItem, editarOrdenConsumo, editarOrdenConsumoItem } from "./action";

export const metadata: Metadata = {
    title: "Editar orden",
};

export function bindEditarOrdenConsumo(ordenId: number) {
    return editarOrdenConsumo.bind(null, ordenId);
}

export function bindEditarOrdenConsumoItem(itemId: number) {
    return editarOrdenConsumoItem.bind(null, itemId);
}

export function bindCrearOrdenConsumo(ordenId: number) {
    return crearOrdenConsumoItem.bind(null, ordenId);
}

export function bindBorrarOrdenConsumoItem(ordenId: number, itemId: number) {
    return borrarOrdenConsumoItem.bind(null, ordenId, itemId);
}

export default async function Page({ params }: { params: { ordenId: number } }) {
    const orden = await findOrdenConsumo(params.ordenId);

    if (!orden) {
        return notFound();
    }
    const items = await getOrdenConsumoItems(orden.id);

    const almacenes = (await getAlmacenes(undefined, { page: 1, limit: 100 })).data;
    const productos = (await getProductos(undefined, { page: 1, limit: 100 })).data;

    const editarOrdenWithId = bindEditarOrdenConsumo(orden.id);

    return (
        <ResponsiveLayout
            title="Editar Orden"
            acciones={() => {
                return (
                    <>
                        <LinkAction href={`/ordenes/consumo/${orden.id}`}>Volver</LinkAction>
                        <LinkAction href={`/ordenes/consumo/${orden.id}/borrar`}>Borrar</LinkAction>
                    </>
                );
            }}
        >
            <section className="w-full space-y-6">
                <div className="card w-full shadow-lg">
                    <EditarForm orden={orden} onSubmit={editarOrdenWithId} />
                </div>

                {items.map((item) => (
                    <div className="space-y-2">
                        <div className="card w-full shadow-lg">
                            <EditarItemForm
                                key={item.id}
                                item={item}
                                almacenes={almacenes}
                                productos={productos}
                                onEditar={bindEditarOrdenConsumoItem(item.id)}
                                onBorrar={bindBorrarOrdenConsumoItem(orden.id, item.id)}
                            />
                        </div>
                    </div>
                ))}

                <div className="card w-full shadow-lg">
                    <CrearItemForm
                        orden={orden}
                        almacenes={almacenes}
                        productos={productos}
                        onSubmit={bindCrearOrdenConsumo(orden.id)}
                    />
                </div>
            </section>
        </ResponsiveLayout>
    );
}
