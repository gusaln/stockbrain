import ResponsiveLayout, { LinkAction } from "@/components/layouts/ResponsiveLayout";
import { crearProducto } from "./action";
import CrearProductoForm from "./CrearProductoForm";
import { getCategorias } from "@/lib/queries";

export default async function Page() {
    const categorias = (await getCategorias(undefined, { page: 1, limit: 100 })).data;

    return (
        <ResponsiveLayout
            title="Registrar un Producto"
            acciones={() => {
                return <LinkAction href="/productos">Volver</LinkAction>;
            }}
        >
            <section className="w-full justify-center flex">
                <div className="card w-fit shadow-lg">
                    <CrearProductoForm categorias={categorias} onSubmit={crearProducto} />
                </div>
            </section>
        </ResponsiveLayout>
    );
}
