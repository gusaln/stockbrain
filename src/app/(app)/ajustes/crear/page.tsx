import ResponsiveLayout, { LinkAction } from "@/components/layouts/ResponsiveLayout";
import { getProductos } from "@/lib/queries";
import CrearForm from "./CrearForm";
import { crearAjuste } from "./action";

export default async function Page() {
    const productos = (await getProductos(undefined, { page: 1, limit: 100 })).data;

    return (
        <ResponsiveLayout
            title="Registrar ajuste de inventario"
            acciones={() => {
                return <LinkAction href="/ajustes">Volver</LinkAction>;
            }}
        >
            <section className="w-full justify-center flex">
                <div className="card w-fit shadow-lg">
                    <CrearForm productos={productos} onSubmit={crearAjuste} />
                </div>
            </section>
        </ResponsiveLayout>
    );
}
