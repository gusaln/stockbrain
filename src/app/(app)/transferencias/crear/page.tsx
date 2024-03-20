import ResponsiveLayout, { LinkAction } from "@/components/layouts/ResponsiveLayout";
import { getAlmacenes, getProductos } from "@/lib/queries";
import CrearForm from "./CrearForm";
import { crearTransferencia } from "./action";

export default async function Page() {
    const almacenes = (await getAlmacenes(undefined, { page: 1, limit: 100 })).data;
    const productos = (await getProductos(undefined, { page: 1, limit: 100 })).data;

    return (
        <ResponsiveLayout
            title="Registrar Transferencias"
            acciones={() => {
                return <LinkAction href="/transferencias">Volver</LinkAction>;
            }}
        >
            <section className="w-full justify-center flex">
                <div className="card w-full shadow-lg">
                    <CrearForm almacenes={almacenes} productos={productos} onSubmit={crearTransferencia} />
                </div>
            </section>
        </ResponsiveLayout>
    );
}
