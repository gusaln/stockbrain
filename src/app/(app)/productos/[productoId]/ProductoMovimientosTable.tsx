"use client";

import { Loader } from "@/components/Loader";
import { PaginationSteps, usePagination } from "@/components/pagination";
import { formatDatetime } from "@/lib/format";
import { MovimientoInventarioTipoLabelMap, MovimientoInventarioWithRelations } from "@/lib/queries/shared";
import { PaginatedResponse } from "@/utils";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { useQuery } from "@tanstack/react-query";
import { MovimientoAlmacen, MovimientoOrigen } from "../../movimientos/Table";

export function ProductoMovimientosTable({ productoId }: { productoId: number }) {
    const { page, setPage, limit, setLimit } = usePagination();

    const { data, error, isFetching, isError } = useQuery({
        queryKey: [`/productos/api/${productoId}/movimientos`, { page: page, limit: limit }] as const,
        queryFn: async ({ queryKey }) => {
            const queryParams = queryKey[1]; // Cast queryKey[1] to the correct type

            const url = new URLSearchParams({
                page: queryParams.page.toString(),
                limit: queryParams.limit.toString(),
            });

            const res = await fetch(queryKey[0] + "?" + url.toString());
            return (await res.json()) as PaginatedResponse<MovimientoInventarioWithRelations>;
        },
        initialData: {
            data: [],
            page: 1,
            limit: 10,
            total: 0,
        } as PaginatedResponse<MovimientoInventarioWithRelations>,
    });

    if (data.data.length < 1 && isFetching) return <Loader />;
    if (isError)
        return (
            <div role="alert" className="alert alert-error">
                <ExclamationCircleIcon width="24" />
                <span>{error.message}</span>
            </div>
        );

    return (
        <table className="table table-sm">
            <thead>
                <tr>
                    <th>Operador</th>
                    <th>Fecha</th>
                    <th>Almacén</th>
                    <th>Estado</th>
                    <th>Tipo</th>
                    <th>Cantidad</th>
                    <th></th>
                </tr>
            </thead>

            <tbody>
                {data.data?.length < 1 ? (
                    <td colSpan="6">No hay registros aún</td>
                ) : (
                    data.data?.map((movimiento) => {
                        return (
                            <tr key={movimiento.id}>
                                <td>{movimiento.operador.nombre}</td>
                                <td>{formatDatetime(movimiento.fecha)}</td>
                                <td>
                                    <MovimientoAlmacen movimiento={movimiento} />{" "}
                                </td>
                                <td>
                                    <MovimientoOrigen movimiento={movimiento} />
                                </td>
                                <td>{MovimientoInventarioTipoLabelMap.get(movimiento.tipo)}</td>
                                <td>{movimiento.cantidad}</td>
                                <th></th>
                            </tr>
                        );
                    })
                )}
            </tbody>

            <tfoot>
                <tr>
                    <td colSpan="6">
                        <PaginationSteps page={page} total={data.total} limit={limit} onPageChange={setPage} />
                    </td>
                </tr>
            </tfoot>
        </table>
    );
}
