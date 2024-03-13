import ResponsiveLayout, { LinkAction } from "@/components/layouts/ResponsiveLayout";
import { findProducto, getProductoStocks } from "@/lib/queries";
import { PRODUCTO_ESTADO } from "@/lib/queries/shared";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductoMovimientosTable } from "./ProductoMovimientosTable";

export const metadata: Metadata = {
    // title: "Editar producto",
};

export default async function Page({ params }: { params: { productoId: number } }) {
    const producto = await findProducto(params.productoId);

    if (!producto) {
        return notFound();
    }

    const stocks = await getProductoStocks(producto.id);

    return (
        <ResponsiveLayout
            title={`Producto ${producto.marca} - ${producto.modelo}`}
            acciones={() => {
                return <LinkAction href="/productos">Volver</LinkAction>;
            }}
        >
            <div className="space-y-8">
                <section className="w-full justify-center grid grid-cols-3 gap-6">
                    <div className="card w-full shadow-lg">
                        <div className="card-body">
                            <h2 className="card-title">Bueno</h2>
                            <p className="flex justify-end font-medium text-2xl lg:text-4xl">{stocks[PRODUCTO_ESTADO.BUENO]}</p>
                        </div>
                    </div>

                    <div className="card w-full shadow-lg">
                        <div className="card-body">
                            <h2 className="card-title">En revision</h2>
                            <p className="flex justify-end font-medium text-2xl lg:text-4xl">{stocks[PRODUCTO_ESTADO.REVISION]}</p>
                        </div>
                    </div>

                    <div className="card w-full shadow-lg">
                        <div className="card-body">
                            <h2 className="card-title">Defectuoso</h2>
                            <p className="flex justify-end font-medium text-2xl lg:text-4xl">
                                {stocks[PRODUCTO_ESTADO.DEFECTUOSO]}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="w-full justify-center">
                    <section className="card w-full shadow-md">
                        <div className="card-body">
                            <h2 className="card-title">Movimientos de inventario</h2>
                            <ProductoMovimientosTable productoId={producto.id} />
                        </div>
                    </section>
                </section>
            </div>
        </ResponsiveLayout>
    );
}
