import ResponsiveLayout, { LinkAction } from "@/components/layouts/ResponsiveLayout";
import { getProductosStocks } from "@/lib/queries";
import { Table } from "./movimientos/Table";
import { PRODUCTO_ESTADO } from "@/lib/queries/shared";

export default async function Dashboard() {
    const stocks = await getProductosStocks();
    return (
        <ResponsiveLayout title="Dashboard">
            <div className="space-y-8">
                <section className="w-full justify-center grid grid-cols-3 gap-6">
                    <div className="card w-full shadow-lg">
                        <div className="card-body">
                            <h2 className="card-title">Bueno</h2>
                            <p className="flex justify-end font-medium text-2xl lg:text-4xl">
                                {stocks[PRODUCTO_ESTADO.BUENO]}
                            </p>
                        </div>
                    </div>

                    <div className="card w-full shadow-lg">
                        <div className="card-body">
                            <h2 className="card-title">En revisión</h2>
                            <p className="flex justify-end font-medium text-2xl lg:text-4xl">
                                {stocks[PRODUCTO_ESTADO.REVISION]}
                            </p>
                        </div>
                    </div>

                    <div className="card w-full shadow-lg">
                        <div className="card-body">
                            <h2 className="card-title">Dañado</h2>
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
                            <Table />
                        </div>
                    </section>
                </section>
            </div>
        </ResponsiveLayout>
    );
}
