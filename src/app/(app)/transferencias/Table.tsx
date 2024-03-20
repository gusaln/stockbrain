"use client";
import { Loader } from "@/components/Loader";
import { PaginationSteps, usePagination } from "@/components/pagination";
import { formatDatetime } from "@/lib/format";
import { MovimientoInventarioWithRelations } from "@/lib/queries/shared";
import { PaginatedResponse } from "@/utils";
import { ExclamationCircleIcon } from "@heroicons/react/16/solid";
import { useQuery } from "@tanstack/react-query";
import { MovimientoAlmacen, MovimientoOrigen } from "../movimientos/Table";

export function Table() {
    const { page, setPage, limit, setLimit } = usePagination();

    const { data, error, isFetching, isError } = useQuery({
        queryKey: ["/transferencias/api", { page: page, limit: limit }],
        queryFn: async ({ queryKey }) => {
            const queryParams = queryKey[1] as { page: number; limit: number }; // Cast queryKey[1] to the correct type

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
                    <th>Producto</th>
                    <th>Estado</th>
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
                                <MovimientoAlmacen movimiento={movimiento} />{" "}
                            </td>
                            <td>
                                <a
                                    href={`/productos/${movimiento.productoId}`}
                                    className="link link-secondary"
                                    target="_blank"
                                >
                                    {movimiento.producto.marca} {movimiento.producto.modelo}
                                </a>
                            </td>
                            <td>
                                <MovimientoOrigen movimiento={movimiento} />{" "}
                            </td>
                            <td>{movimiento.cantidad}</td>
                            <th>
                                <a href={`/transferencias/${movimiento.id}/editar`} className="btn btn-ghost btn-sm">
                                    editar
                                </a>
                                <a href={`/transferencias/${movimiento.id}/borrar`} className="btn btn-ghost btn-sm">
                                    borrar
                                </a>
                            </th>
                        </tr>
                    );
                })}
            </tbody>

            <tfoot>
                <tr>
                    <td colSpan="7">
                        <PaginationSteps page={page} total={data.total} limit={limit} onPageChange={setPage} />
                    </td>
                </tr>
            </tfoot>
        </table>
    );
}
