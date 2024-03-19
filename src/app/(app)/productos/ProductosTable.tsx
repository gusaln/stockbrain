"use client";
import { Loader } from "@/components/Loader";
import Input from "@/components/forms/Input";
import { PaginationSteps, usePagination } from "@/components/pagination";
import { Categoria, Producto } from "@/lib/queries";
import { PaginatedResponse } from "@/utils";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function ProductosTable() {
    const { page, setPage, limit, setLimit } = usePagination();

    const [busqueda, setBusqueda] = useState("");

    const { data, error, isLoading, isError } = useQuery({
        queryKey: ["/productos/api", { busqueda, page: page, limit: limit }],
        queryFn: async ({ queryKey }) => {
            const queryParams = queryKey[1] as { busqueda: string; page: number; limit: number };
            const url = new URLSearchParams({
                busqueda: queryParams.busqueda,
                page: queryParams.page.toString(),
                limit: queryParams.limit.toString(),
            });

            const res = await fetch(queryKey[0] + "?" + url.toString());

            return (await res.json()) as PaginatedResponse<Producto & { categoria: Pick<Categoria, "nombre"> }>;
        },
        initialData: {
            data: [],
            page: 1,
            limit: 10,
            total: 0,
        },
    });

    if (isLoading) return <Loader />;
    if (isError)
        return (
            <div role="alert" className="alert alert-error">
                <ExclamationCircleIcon width="24" />

                <span>{error.message}</span>
            </div>
        );
    return (
        <div className="w-full">
            <div className="w-full">
                <Input
                    label="Busqueda por marca o modelo"
                    value={busqueda}
                    onChange={(ev) => setBusqueda(ev.target.value)}
                />
            </div>

            <table className="w-full table table-sm">
                <thead>
                    <tr>
                        <th>Modelo</th>
                        <th>Marca</th>
                        <th>Categoria</th>
                        <th>Descripción</th>
                        <th>Imagen</th>
                    </tr>
                </thead>

                <tbody>
                    {data.data?.map((p) => {
                        return (
                            <tr key={p.id}>
                                <th>{p.modelo}</th>
                                <th>{p.marca}</th>
                                <td>{p.categoria.nombre}</td>
                                <td>{p.descripcion}</td>
                                <td>{p.imagen ?? "-"}</td>
                                <th>
                                    <a href={`/productos/${p.id}`} className="btn btn-ghost btn-sm">
                                        detalles
                                    </a>
                                    <a href={`/productos/${p.id}/editar`} className="btn btn-ghost btn-sm">
                                        editar
                                    </a>
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
        </div>
    );
}
