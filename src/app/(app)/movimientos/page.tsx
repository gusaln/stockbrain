import ResponsiveLayout, { LinkAction } from "@/components/layouts/ResponsiveLayout";
import { Table } from "./Table";

export default function Page() {
    return (
        <ResponsiveLayout title="Movimientos del Inventario">
            <section className="card w-full shadow-md">
                <div className="card-body">
                    <Table />
                </div>
            </section>
        </ResponsiveLayout>
    );
}
