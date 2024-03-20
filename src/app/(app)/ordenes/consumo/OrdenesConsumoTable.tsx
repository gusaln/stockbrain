"use client";
import { Loader } from "@/components/Loader";
import { PaginationSteps, usePagination } from "@/components/pagination";
import { formatDatetime } from "@/lib/format";
import { OrdenConsumo } from "@/lib/queries";
import { PaginatedResponse } from "@/utils";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { useQuery } from "@tanstack/react-query";

export function OrdenesConsumoTable() {
    const { page, setPage, limit, setLimit } = usePagination();

    const { data, error, isFetching, isError } = useQuery({
        queryKey: ["/ordenes/consumo/api", { page: page, limit: limit }],
        queryFn: async ({ queryKey }) => {
            const url = new URLSearchParams({
                page: queryKey[1].page.toString(),
                limit: queryKey[1].limit.toString(),
            });

            const res = await fetch(queryKey[0] + "?" + url.toString());
            return (await res.json()) as PaginatedResponse<OrdenConsumo>;
        },
        initialData: {
            data: [],
            page: 1,
            limit: 10,
            total: 0,
        } as PaginatedResponse<OrdenConsumo>,
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
                    <th>Descripción</th>
                    <th>Fecha</th>
                    <th>Operador</th>
                </tr>
            </thead>

            <tbody>
                {data.data?.map((orden) => {
                    return (
                        <tr key={orden.id}>
                            <td>{orden.descripcion}</td>
                            <td>{formatDatetime( orden.fecha)}</td>
                            <td>{orden.operador.nombre}</td>
                            <th>
                                <a href={`/ordenes/consumo/${orden.id}`} className="btn btn-ghost btn-sm">detalles</a>
                                <a href={`/ordenes/consumo/${orden.id}/editar`} className="btn btn-ghost btn-sm">editar</a>
                            </th>
                        </tr>
                    );
                })}
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
