import ResponsiveLayout, { LinkAction } from "@/components/layouts/ResponsiveLayout";
import CrearOrdenConsumoForm from "./CrearOrdenConsumoForm";
import { crearOrdenConsumo } from "./action";
import { getAlmacenes, getProductos } from "@/lib/queries";

export default async function Page() {
    const almacenes = (await getAlmacenes(undefined, { page: 1, limit: 100 })).data;
    const productos = (await getProductos(undefined, { page: 1, limit: 100 })).data;

    return (
        <ResponsiveLayout
            title="Registrar la orden de consumo"
            acciones={() => {
                return <LinkAction href="/ordenes/consumo">Volver</LinkAction>;
            }}
        >
            <section className="w-full justify-center flex">
                <div className="card w-fit shadow-lg">
                    <CrearOrdenConsumoForm almacenes={almacenes} productos={productos} onSubmit={crearOrdenConsumo} />
                </div>
            </section>
        </ResponsiveLayout>
    );
}
