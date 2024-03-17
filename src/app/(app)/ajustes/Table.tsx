"use client";
import { Loader } from "@/components/Loader";
import { PaginationSteps, usePagination } from "@/components/pagination";
import { formatDatetime } from "@/lib/format";
import { AjusteInventarioWithRelations } from "@/lib/queries";
import { AjusteInventarioTipoMap } from "@/lib/queries/shared";
import { PaginatedResponse } from "@/utils";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { useQuery } from "@tanstack/react-query";

export function Table() {
    const { page, setPage, limit, setLimit } = usePagination();

    const { data, error, isFetching, isError } = useQuery({
        queryKey: ["/ajustes/api", { page: page, limit: limit }],
        queryFn: async ({ queryKey }) => {
            const queryParams = queryKey[1] as { page: number; limit: number }; // Cast queryKey[1] to the correct type

            const url = new URLSearchParams({
                page: queryParams.page.toString(),
                limit: queryParams.limit.toString(),
            });

            const res = await fetch(queryKey[0] + "?" + url.toString());
            return (await res.json()) as PaginatedResponse<AjusteInventarioWithRelations>;
        },
        initialData: {
            data: [],
            page: 1,
            limit: 10,
            total: 0,
        },
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
                    <th>Tipo</th>
                    <th>Cantidad</th>
                    <th>Motivo</th>
                    <th></th>
                </tr>
            </thead>

            <tbody>
                {data.data?.map((ajuste) => {
                    return (
                        <tr key={ajuste.id}>
                            <td>{ajuste.operador.nombre}</td>
                            <td>{formatDatetime(ajuste.fecha)}</td>
                            <td>{ajuste.almacen.nombre}</td>
                            <td>{ajuste.producto.marca} - {ajuste.producto.modelo}</td>
                            <td>{AjusteInventarioTipoMap.get(ajuste.tipo)}</td>
                            <td>{ajuste.cantidad}</td>
                            <td>{ajuste.motivo}</td>
                            <th>
                                <a href={`/ajustes/${ajuste.id}/editar`} className="btn btn-ghost btn-sm">
                                    editar
                                </a>
                            </th>
                        </tr>
                    );
                })}
            </tbody>

            <tfoot>
                <tr>
                    <td colSpan="8">
                        <PaginationSteps page={page} total={data.total} limit={limit} onPageChange={setPage} />
                    </td>
                </tr>
            </tfoot>
        </table>
    );
}
