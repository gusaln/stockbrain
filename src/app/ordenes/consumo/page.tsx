import ResponsiveLayout, { LinkAction } from "@/components/layouts/ResponsiveLayout";
import { OrdenesConsumoTable } from "./OrdenesConsumoTable";

export default function Page() {
    return (
        <ResponsiveLayout
            title="Ordenes de consumo"
            acciones={() => {
                return <LinkAction href="/ordenes/consumo/crear">Registrar</LinkAction>;
            }}
        >
            <section className="card w-full shadow-md">
                <div className="card-body">
                    <OrdenesConsumoTable/>
                </div>
            </section>
        </ResponsiveLayout>
    );
}