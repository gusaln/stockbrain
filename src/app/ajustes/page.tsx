import ResponsiveLayout, { LinkAction } from "@/components/layouts/ResponsiveLayout";
import { Table } from "./Table";

export default function Page() {
    return (
        <ResponsiveLayout
            title="Ajustes de Inventario"
            acciones={() => {
                return <LinkAction href="/ajustes/crear">Nuevo</LinkAction>;
            }}
        >
            <section className="card w-full shadow-md">
                <div className="card-body">
                    <Table />
                </div>
            </section>
        </ResponsiveLayout>
    );
}