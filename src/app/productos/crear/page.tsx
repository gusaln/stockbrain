import ResponsiveLayout, { LinkAction } from "@/components/layouts/ResponsiveLayout";
import { crearProducto } from "./action";
import CrearProductoForm from './CrearProductoForm';

export default function Page(){
    return(
        <ResponsiveLayout
            title="Registrar un Producto"
            acciones={() => {
                return <LinkAction href='/productos'>Volver</LinkAction>;
            }}
        >
            <section className="w-full justify-center flex">
                <div className="card w-fit shadow-lg">
                    <CrearProductoForm onSubmit={crearProducto} />
                </div>
            </section>
        </ResponsiveLayout>
    )
}