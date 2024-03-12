import ResponsiveLayout, { LinkAction } from "@/components/layouts/ResponsiveLayout";
import { PRODUCTO_ESTADO, findCategoria, findProducto, getCategorias, getProductoStocks } from "@/lib/queries";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import EditarForm from "./EditarForm";
import { editarProducto } from "./action";

export const metadata: Metadata = {
    // title: "Editar producto",
};

export default async function Page({ params }: { params: { productoId: number } }) {
    const producto = await findProducto(params.productoId);

    if (!producto) {
        return notFound();
    }

    const stocks = await getProductoStocks(producto.id)

    return (
        <ResponsiveLayout
            title={`Producto ${producto.marca} - ${producto.modelo}`}
            acciones={() => {
                return <LinkAction href="/productos">Volver</LinkAction>;
            }}
        >
            <section className="w-full justify-center grid grid-cols-3 gap-6">
                <div className="card w-full shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title">Bueno</h2>
                        <p className="flex justify-end font-medium text-3xl">
                            {stocks[PRODUCTO_ESTADO.BUENO]}
                        </p>
                    </div>
                </div>

                <div className="card w-full shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title">En revision</h2>
                        <p className="flex justify-end font-medium text-3xl">
                            {stocks[PRODUCTO_ESTADO.REVISION]}
                        </p>
                    </div>
                </div>

                <div className="card w-full shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title">Defectuoso</h2>
                        <p className="flex justify-end font-medium text-3xl">
                            {stocks[PRODUCTO_ESTADO.DEFECTUOSO]}
                        </p>
                    </div>
                </div>
            </section>
        </ResponsiveLayout>
    );
}
