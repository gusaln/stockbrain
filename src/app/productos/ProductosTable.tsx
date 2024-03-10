"use client";
import { Loader } from "@/components/Loader";
import { PaginationSteps, usePagination } from "@/components/pagination";
import { Categoria, Producto } from "@/lib/queries";
import { PaginatedResponse } from "@/utils";
import { useQuery } from "@tanstack/react-query";

export function ProductosTable(){
    const { page, setPage, limit, setLimit } = usePagination();

    const {data, error, isLoading, isError } = useQuery({
        queryKey: ["/productos/api", { page: page, limit: limit }],
        queryFn: async ({ queryKey }) => {
            const queryParams = queryKey[1] as {page: number, limit: number};
            const url = new URLSearchParams({
                page: queryParams.page.toString(),
                limit: queryParams.limit.toString(),
            });

            const res = await fetch(queryKey[0] + "?" + url.toString());
            
            return (await res.json()) as PaginatedResponse<Producto & {categoria: Pick<Categoria, "nombre">}>;
        },
        initialData: {
            data: [],
            page: 1, 
            limit: 10, 
            total: 0,
        },
    });

    if(isLoading) return <Loader />;
    if(isError)
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
                    <th>Categoria</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Descripción</th>
                    <th>Imagen</th>
                </tr>
            </thead>

            <tbody>
                {data.data?.map((p) =>{
                    return(
                        <tr key={p.id}>
                            <td>{p.categoria.nombre}</td>
                            <th>{p.marca}</th>
                            <th>{p.modelo}</th>
                            <td>{p.descripcion}</td>
                            <td>{p.imagen ?? '-'}</td>
                            <th>
                                <a href={`/productos/${p.id}/editar`} className="btn btn-ghost btn-sm">editar</a>
                            </th>
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