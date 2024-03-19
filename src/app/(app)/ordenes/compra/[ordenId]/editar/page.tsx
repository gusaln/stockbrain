import ResponsiveLayout, { LinkAction } from "@/components/layouts/ResponsiveLayout";
import { findOrdenCompra, getAlmacenes, getOrdenCompraItems, getProductos, getProveedores } from "@/lib/queries";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import CrearItemForm from "./CrearItemForm";
import EditarForm from "./EditarForm";
import EditarItemForm from "./EditarItemForm";
import { borrarOrdenCompraItem, crearOrdenCompraItem, editarOrdenCompra, editarOrdenCompraItem } from "./action";
import BorrarItemForm from "./BorrarItemForm";

export const metadata: Metadata = {
    title: "Editar orden",
};

export function bindEditarOrdenCompra(ordenId: number) {
    return editarOrdenCompra.bind(null, ordenId);
}

export function bindEditarOrdenCompraItem(itemId: number) {
    return editarOrdenCompraItem.bind(null, itemId);
}

export function bindCrearOrdenCompra(ordenId: number) {
    return crearOrdenCompraItem.bind(null, ordenId);
}

export function bindBorrarOrdenCompraItem(ordenId: number, itemId: number) {
    return borrarOrdenCompraItem.bind(null, ordenId, itemId);
}

export default async function Page({ params }: { params: { ordenId: number } }) {
    const orden = await findOrdenCompra(params.ordenId);

    if (!orden) {
        return notFound();
    }
    const items = await getOrdenCompraItems(orden.id);

    const proveedores = (await getProveedores(undefined, { page: 1, limit: 100 })).data;
    const almacenes = (await getAlmacenes(undefined, { page: 1, limit: 100 })).data;
    const productos = (await getProductos(undefined, { page: 1, limit: 100 })).data;

    const editarOrdenWithId = bindEditarOrdenCompra(orden.id);

    return (
        <ResponsiveLayout
            title="Editar Orden"
            acciones={() => {
                return (
                    <>
                        <LinkAction href={`/ordenes/compra/${orden.id}`}>Volver</LinkAction>
                        <LinkAction href={`/ordenes/compra/${orden.id}/borrar`}>Borrar</LinkAction>
                    </>
                );
            }}
        >
            <section className="w-full space-y-6">
                <div className="card w-full shadow-lg">
                    <EditarForm orden={orden} proveedores={proveedores} onSubmit={editarOrdenWithId} />
                </div>

                {items.map((item) => (
                    <div className="space-y-2">
                        <div className="card w-full shadow-lg">
                            <EditarItemForm
                                key={item.id}
                                item={item}
                                almacenes={almacenes}
                                productos={productos}
                                onEditar={bindEditarOrdenCompraItem(item.id)}
                                onBorrar={bindBorrarOrdenCompraItem(orden.id, item.id)}
                            />
                        </div>
                    </div>
                ))}

                <div className="card w-full shadow-lg">
                    <CrearItemForm
                        orden={orden}
                        almacenes={almacenes}
                        productos={productos}
                        onSubmit={bindCrearOrdenCompra(orden.id)}
                    />
                </div>
            </section>
        </ResponsiveLayout>
    );
}
