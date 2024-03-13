import ResponsiveLayout, { LinkAction } from "@/components/layouts/ResponsiveLayout";
import { findProveedor, isProveedorUsed } from "@/lib/queries";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import BorrarForm from "./BorrarForm";
import { borrarProveedor } from "./action";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

export const metadata: Metadata = {
    title: "Borrar proveedor",
};

export function bindProveedorId(proveedorId: number) {
    return borrarProveedor.bind(null, proveedorId);
}

export default async function Page({ params }: { params: { proveedorId: number } }) {
    const proveedor = await findProveedor(params.proveedorId);

    if (!proveedor) {
        return notFound();
    }

    const estaEnUso = await isProveedorUsed(proveedor.id);

    const borrarProveedorWithId = bindProveedorId(proveedor.id);

    return (
        <ResponsiveLayout
            title="Borrar Proveedor"
            acciones={() => {
                return <LinkAction href="/admin/proveedores">Volver</LinkAction>;
            }}
        >
            <section className="w-full justify-center flex">
                <div className="card w-1/2 shadow-lg">
                    {estaEnUso ? (
                        <div role="alert" className="alert alert-error">
                            <ExclamationCircleIcon width="16" />
                            <span>Este proveedor tiene ordenes de compra asociada y no puede borrarse</span>
                        </div>
                    ) : (
                        <BorrarForm proveedor={proveedor} onSubmit={borrarProveedorWithId} />
                    )}
                </div>
            </section>
        </ResponsiveLayout>
    );
}
