import ResponsiveLayout, { LinkAction } from "@/components/layouts/ResponsiveLayout";
import { formatDatetime } from "@/lib/format";
import { findOrdenCompraWithRelations, getOrdenCompraItemsWithRelations } from "@/lib/queries";
import { formatMoney } from "@/lib/queries/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    // title: "Editar orden",
};

type OrdenCompraItemsWithRelations = Awaited<ReturnType<typeof getOrdenCompraItemsWithRelations>>[number];

export default async function Page({ params }: { params: { ordenId: number } }) {
    const orden = await findOrdenCompraWithRelations(params.ordenId);

    if (!orden) {
        return notFound();
    }

    const items = await getOrdenCompraItemsWithRelations(orden.id);

    return (
        <ResponsiveLayout
            title={`Orden #${orden.id}`}
            acciones={() => {
                return (
                    <>
                        <LinkAction href="/ordenes/compra">Volver</LinkAction>
                        <LinkAction href={"/ordenes/compra/" + orden.id + "/editar"}>Editar</LinkAction>
                        <LinkAction href={`/ordenes/compra/${orden.id}/borrar`}>Borrar</LinkAction>
                    </>
                );
            }}
        >
            <div className="space-y-8">
                <section className="w-full justify-center">
                    <div className="card w-full shadow-md">
                        <div className="card-body">
                            <h2 className="card-title">Orden</h2>

                            <dl>
                                <dt className="font-semibold">Proveedor</dt>
                                <dd>{orden.proveedor.nombre}</dd>

                                <dt className="font-semibold">Fecha</dt>
                                <dd>{formatDatetime(orden.fecha)}</dd>
                                {/* <dd>{orden.fecha}</dd> */}

                                <dt className="font-semibold">Operador</dt>
                                <dd>{orden.operador.nombre}</dd>
                            </dl>
                        </div>
                    </div>
                </section>

                <section className="w-full justify-center">
                    <div className="card w-full shadow-md">
                        <div className="card-body">
                            <h2 className="card-title">Items</h2>
                            <OrdenItemsTable items={items} />
                        </div>
                    </div>
                </section>
            </div>
        </ResponsiveLayout>
    );
}

async function OrdenItemsTable({ items }: { items: OrdenCompraItemsWithRelations[] }) {
    return (
        <table className="table table-sm">
            <thead>
                <tr>
                    <th>Almacén</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                </tr>
            </thead>

            <tbody>
                {items.map((item) => {
                    return (
                        <tr key={item.id}>
                            <td>{item.almacen.nombre}</td>
                            <td>
                                <a href={`/productos/${item.productoId}`} className="link link-secondary" target="_blank">{item.producto.marca} {item.producto.modelo}</a>
                                
                            </td>
                            <td>
                                {item.cantidad} ({formatMoney(item.precioUnitario)} c/u)
                            </td>
                            <td>{formatMoney(item.total)}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
