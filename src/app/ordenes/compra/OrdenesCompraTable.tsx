"use client";
import { Loader } from "@/components/Loader";
import { PaginationSteps, usePagination } from "@/components/pagination";
import { OrdenCompra} from "@/lib/queries";
import { PaginatedResponse } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function OrdenesCompraTable() {
    const { page, setPage, limit, setLimit } = usePagination();

    const { data, error, isLoading, isError } = useQuery({
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

    if (isLoading) return <Loader />;
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
                    <th>ID Proveedor</th>
                    <th>Fecha</th>
                    <th>ID Operador</th>
                </tr>
            </thead>

            <tbody>
                {data.data?.map((p) => {
                    return (
                        <tr key={p.id}>
                            <td>{p.proveedorId}</td>
                            <td>{p.fecha}</td>
                            <td>{p.operadorId}</td>
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