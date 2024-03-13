"use client";
import { Loader } from "@/components/Loader";
import { PaginationSteps, usePagination } from "@/components/pagination";
import { Categoria } from "@/lib/queries/shared";
import { PaginatedResponse } from "@/utils";
import { ExclamationCircleIcon } from "@heroicons/react/16/solid";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function Table() {
    const { page, setPage, limit, setLimit } = usePagination();

    const { data, error, isLoading, isFetching, isError } = useQuery({
        queryKey: ["/admin/categorias/api", { page: page, limit: limit }],
        queryFn: async ({ queryKey }) => {
            const url = new URLSearchParams({
                page: queryKey[1].page.toString(),
                limit: queryKey[1].limit.toString(),
            });

            const res = await fetch(queryKey[0] + "?" + url.toString());
            return (await res.json()) as PaginatedResponse<Categoria>;
        },
        initialData: {
            data: [],
            page: 1,
            limit: 10,
            total: 0,
        } as PaginatedResponse<Categoria>,
    });

    if (data.data.length < 1 && isFetching) return <Loader />;
    if (isError)
        return (
            <div role="alert" className="alert alert-error">
                
                <ExclamationCircleIcon width="16"></ExclamationCircleIcon>
                <span>{error.message}</span>
            </div>
        );

    return (
        <table className="table table-sm">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th></th>
                </tr>
            </thead>

            <tbody>
                {data.data?.map((categoria) => {
                    return (
                        <tr key={categoria.id}>
                            <td>{categoria.nombre}</td>
                            <td>{categoria.descripcion}</td>
                            <th>
                                <a href={`/categorias/${categoria.id}/editar`} className="btn btn-ghost btn-sm">editar</a>
                            </th>
                        </tr>
                    );
                })}
            </tbody>

            <tfoot>
                <tr>
                    <td colSpan="3">
                        <PaginationSteps page={page} total={data.total} limit={limit} onPageChange={setPage} />
                    </td>
                </tr>
            </tfoot>
        </table>
    );
}
