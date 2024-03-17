import ResponsiveLayout, { LinkAction } from "@/components/layouts/ResponsiveLayout";
import CrearOrdenCompraForm from "./CrearOrdenCompraForm";
import { crearOrdenCompra } from "./action";
import { getAlmacenes, getProductos, getProveedores } from "@/lib/queries";

export default async function Page() {
    const proveedores = (await getProveedores(undefined, { page: 1, limit: 100 })).data;
    const almacenes = (await getAlmacenes(undefined, { page: 1, limit: 100 })).data;
    const productos = (await getProductos(undefined, { page: 1, limit: 100 })).data;

    return (
        <ResponsiveLayout
            title="Registrar la orden de compra"
            acciones={() => {
                return <LinkAction href="/ordenes/compra">Volver</LinkAction>;
            }}
        >
            <section className="w-full justify-center flex">
                <div className="card w-full shadow-lg">
                    <CrearOrdenCompraForm
                        almacenes={almacenes}
                        proveedores={proveedores}
                        productos={productos}
                        onSubmit={crearOrdenCompra}
                    />
                </div>
            </section>
        </ResponsiveLayout>
    );
}
