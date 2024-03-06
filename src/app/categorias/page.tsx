import ResponsiveLayout, { LinkAction } from "@/components/layouts/ResponsiveLayout";
import { Metadata } from "next";
import { Table } from "./Table";

export const metadata: Metadata = {
    title: "Categorias",
};

export default function Page() {
    return (
        <ResponsiveLayout
            title="Categorias"
            acciones={() => {
                return <LinkAction href="/categorias/crear">Nueva</LinkAction>;
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
