"use client";
import { Loader } from "@/components/Loader";
import { PaginationSteps, usePagination } from "@/components/pagination";
import { formatDatetime } from "@/lib/format";
import { OrdenCompra} from "@/lib/queries";
import { PaginatedResponse } from "@/utils";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function OrdenesCompraTable() {
    const { page, setPage, limit, setLimit } = usePagination();

    const { data, error, isFetching, isError } = useQuery({
        queryKey: ["/ordenes/compra/api", { page: page, limit: limit }],
        queryFn: async ({ queryKey }) => {
            const url = new URLSearchParams({
                page: queryKey[1].page.toString(),
                limit: queryKey[1].limit.toString(),
            });

            const res = await fetch(queryKey[0] + "?" + url.toString());
            return (await res.json()) as PaginatedResponse<OrdenCompra>;
        },
        initialData: {
            data: [],
            page: 1,
            limit: 10,
            total: 0,
        } as PaginatedResponse<OrdenCompra>,
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
                    <th>Fecha</th>
                    <th>Proveedor</th>
                    <th>Operador</th>
                </tr>
            </thead>

            <tbody>
                {data.data?.map((p) => {
                    return (
                        <tr key={p.id}>
                            <td>{formatDatetime(p.fecha)}</td>
                            <td>{p.proveedor.nombre}</td>
                            <td>{p.operador.nombre}</td>
                            <th>
                                <button className="btn btn-ghost btn-sm">editar</button>
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
