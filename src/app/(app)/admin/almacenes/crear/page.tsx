import ResponsiveLayout, { LinkAction } from "@/components/layouts/ResponsiveLayout";
import CrearForm from "./CrearForm";
import { crearAlmacen } from "./action";

export default function Page() {
    return (
        <ResponsiveLayout
            title="Registrar categoría"
            acciones={() => {
                return <LinkAction href="/admin/almacenes">Volver</LinkAction>;
            }}
        >
            <section className="w-full justify-center flex">
                <div className="card w-fit shadow-lg">
                    <CrearForm onSubmit={crearAlmacen} />
                </div>
            </section>
        </ResponsiveLayout>
    );
}
