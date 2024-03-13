import ResponsiveLayout, { LinkAction } from "@/components/layouts/ResponsiveLayout";
import { OrdenesCompraTable } from "./OrdenesCompraTable";

export default function Page() {
    return (
        <ResponsiveLayout
            title="Ordenes de compra"
            acciones={() => {
                return <LinkAction href="/ordenes/compra/crear">Registrar</LinkAction>;
            }}
        >
            <section className="card w-full shadow-md">
                <div className="card-body">
                    <OrdenesCompraTable/>
                </div>
            </section>
        </ResponsiveLayout>
    );
}
