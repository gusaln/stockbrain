"use client";
import { Loader } from "@/components/Loader";
import { PaginationSteps, usePagination } from "@/components/pagination";
import { AjusteInventarioWithRelations } from "@/lib/queries";
import { PaginatedResponse } from "@/utils";
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
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
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
                            <td>{ajuste.fecha}</td>
                            <td>{ajuste.almacen.nombre}</td>
                            <td>{ajuste.producto.marca} - {ajuste.producto.modelo}</td>
                            <td>{ajuste.tipo}</td>
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
