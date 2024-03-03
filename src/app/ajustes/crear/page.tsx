import ResponsiveLayout, { LinkAction } from "@/components/layouts/ResponsiveLayout";
import CrearForm from "./CrearForm";
import { crearAjuste } from "./action";

export default function Page() {
    return (
        <ResponsiveLayout
            title="Registrar ajuste de inventario"
            acciones={() => {
                return <LinkAction href="/ajustes">Volver</LinkAction>;
            }}
        >
            <section className="w-full justify-center flex">
                <div className="card w-fit shadow-lg">
                    <CrearForm onSubmit={crearAjuste} />
                </div>
            </section>
        </ResponsiveLayout>
    );
}
