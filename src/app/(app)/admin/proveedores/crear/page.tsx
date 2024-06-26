import ResponsiveLayout, { LinkAction } from "@/components/layouts/ResponsiveLayout";
import CrearForm from "./CrearForm";
import { crearProveedor } from "./action";

export default function Page() {
    return (
        <ResponsiveLayout
            title="Registrar proveedor"
            acciones={() => {
                return <LinkAction href="/admin/proveedores">Volver</LinkAction>;
            }}
        >
            <section className="w-full justify-center flex">
                <div className="card w-fit shadow-lg">
                    <CrearForm onSubmit={crearProveedor} />
                </div>
            </section>
        </ResponsiveLayout>
    );
}
