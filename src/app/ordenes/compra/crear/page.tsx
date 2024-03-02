import ResponsiveLayout, { LinkAction } from "@/components/layouts/ResponsiveLayout";
import CrearOrdenCompraForm from "./CrearOrdenCompraForm";
import { crearOrdenCompra } from "./action";

export default function Page() {
    return (
        <ResponsiveLayout
            title="Registrar la orden de compra"
            acciones={() => {
                return <LinkAction href="/ordenes/compra">Volver</LinkAction>;
            }}
        >
            <section className="w-full justify-center flex">
                <div className="card w-fit shadow-lg">
                    <CrearOrdenCompraForm onSubmit={crearOrdenCompra} />
                </div>
            </section>
        </ResponsiveLayout>
    );
}