import ResponsiveLayout, { LinkAction } from "@/components/layouts/ResponsiveLayout";
import CrearForm from "./CrearForm";
import { crearCategoria } from "./action";

export default function Page() {
    return (
        <ResponsiveLayout
            title="Registrar categoría"
            acciones={() => {
                return <LinkAction href="/admin/categorias">Volver</LinkAction>;
            }}
        >
            <section className="w-full justify-center flex">
                <div className="card w-fit shadow-lg">
                    <CrearForm onSubmit={crearCategoria} />
                </div>
            </section>
        </ResponsiveLayout>
    );
}
