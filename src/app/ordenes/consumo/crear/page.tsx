import ResponsiveLayout, { LinkAction } from "@/components/layouts/ResponsiveLayout";
import CrearOrdenConsumoForm from "./CrearOrdenConsumoForm";
import { crearOrdenConsumo } from "./action";

export default function Page() {
    return (
        <ResponsiveLayout
            title="Registrar la orden de consumo"
            acciones={() => {
                return <LinkAction href="/ordenes/consumo">Volver</LinkAction>;
            }}
        >
            <section className="w-full justify-center flex">
                <div className="card w-fit shadow-lg">
                    <CrearOrdenConsumoForm onSubmit={crearOrdenConsumo} />
                </div>
            </section>
        </ResponsiveLayout>
    );
}