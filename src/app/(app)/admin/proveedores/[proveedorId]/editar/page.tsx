import ResponsiveLayout, { LinkAction } from "@/components/layouts/ResponsiveLayout";
import { findProveedor } from "@/lib/queries";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import EditarForm from "./EditarForm";
import { editarProveedor } from "./action";

export const metadata: Metadata = {
    title: "Editar proveedor",
};

export function bindProveedorId(proveedorId: number) {
    return editarProveedor.bind(null, proveedorId);
}

export default async function Page({ params }: { params: { proveedorId: number } }) {
    const proveedor = await findProveedor(params.proveedorId);

    if (!proveedor) {
        return notFound();
    }

    const editarProveedorWithId = bindProveedorId(proveedor.id);

    return (
        <ResponsiveLayout
            title="Editar Proveedor"
            acciones={() => {
                return <LinkAction href="/admin/proveedores">Volver</LinkAction>;
            }}
        >
            <section className="w-full justify-center flex">
                <div className="card w-1/2 shadow-lg">
                    <EditarForm proveedor={proveedor} onSubmit={editarProveedorWithId} />
                </div>
            </section>
        </ResponsiveLayout>
    );
}
