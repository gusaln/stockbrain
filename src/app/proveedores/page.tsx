import ResponsiveLayout, { LinkAction } from "@/components/layouts/ResponsiveLayout";
import { ProveedoresTable } from "./ProveedoresTable";

export default function Page() {
    return (
        <ResponsiveLayout
            title="Proveedores"
            acciones={() => {
                return <LinkAction href="/proveedores/crear">Registrar</LinkAction>;
            }}
        >
            <section className="card w-full shadow-md">
                <div className="card-body">
                    <ProveedoresTable />
                </div>
            </section>
        </ResponsiveLayout>
    );
}
