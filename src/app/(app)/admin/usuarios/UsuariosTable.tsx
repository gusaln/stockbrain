"use client";
import { Loader } from "@/components/Loader";
import { usePagination } from "@/components/pagination";
import { Usuario } from "@/lib/queries";
import { PaginatedResponse } from "@/utils";
import { ExclamationCircleIcon } from "@heroicons/react/16/solid";
import { useQuery } from "@tanstack/react-query";

export function UsuarioTable() {
    const { page, setPage, limit, setLimit } = usePagination();

    const { data, error, isFetching, isError } = useQuery({
        queryKey: ["/usuarios/api", { page: page, limit: limit }],
        queryFn: async ({ queryKey }) => {
            const queryParams = queryKey[1] as { page: number; limit: number };
            const url = new URLSearchParams({
                page: queryParams.page.toString(),
                limit: queryParams.limit.toString(),
            });

            const res = await fetch(queryKey[0] + "?" + url.toString());
            return (await res.json()) as PaginatedResponse<Usuario>;
        },
        initialData: {
            data: [],
            page: 1,
            limit: 10,
            total: 0,
        } as PaginatedResponse<Usuario>,
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
                    <th>Nombre</th>
                    <th>Email</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {data.data?.map((p) => {
                    return (
                        <tr key={p.id}>
                            <td>{p.nombre}</td>
                            <td>{p.email}</td>
                            <th>
                                <button className="btn btn-ghost btn-sm">editar</button>
                            </th>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
