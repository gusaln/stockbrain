"use client";

import { Loader } from "@/components/Loader";
import { usePagination, PaginationSteps } from "@/components/pagination";
import { MovimientoInventario, MovimientoInventarioTipoLabelMap } from "@/lib/queries/shared";
import { PaginatedResponse } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { MovimientoOrigen } from "../../movimientos/Table";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { formatDatetime } from "@/lib/format";

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
            return (await res.json()) as PaginatedResponse<MovimientoInventario>;
        },
        initialData: {
            data: [],
            page: 1,
            limit: 10,
            total: 0,
        } as PaginatedResponse<MovimientoInventario>,
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
                    <th>Estado</th>
                    <th>Tipo</th>
                    <th>Cantidad</th>
                    <th></th>
                </tr>
            </thead>

            <tbody>
                {data.data?.map((movimiento) => {
                    return (
                        <tr key={movimiento.id}>
                            <td>{movimiento.operador.nombre}</td>
                            <td>{formatDatetime(movimiento.fecha)}</td>
                            <td>
                                <MovimientoOrigen movimiento={movimiento} />
                            </td>
                            <td>{MovimientoInventarioTipoLabelMap.get(movimiento.tipo)}</td>
                            <td>{movimiento.cantidad}</td>
                            <th></th>
                        </tr>
                    );
                })}
            </tbody>

            <tfoot>
                <tr>
                    <td colSpan={6}>
                        <PaginationSteps page={page} total={data.total} limit={limit} onPageChange={setPage} />
                    </td>
                </tr>
            </tfoot>
        </table>
    );
}
