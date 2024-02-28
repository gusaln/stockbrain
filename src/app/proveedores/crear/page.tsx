import ResponsiveLayout, { LinkAction } from "@/components/layouts/ResponsiveLayout";
import CrearProveedorForm from "./CrearProveedorForm";
import { crearProveedor } from "./action";

export default function Page() {
    return (
        <ResponsiveLayout
            title="Registrar proveedor"
            acciones={() => {
                return <LinkAction href="/proveedor">Volver</LinkAction>;
            }}
        >
            <section className="w-full justify-center flex">
                <div className="card w-fit shadow-lg">
                    <CrearProveedorForm onSubmit={crearProveedor} />
                </div>
            </section>
        </ResponsiveLayout>
    );
}
