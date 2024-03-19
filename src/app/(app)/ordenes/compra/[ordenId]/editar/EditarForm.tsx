"use client";

import { FormError } from "@/components/forms/FormError";
import Input from "@/components/forms/Input";
import Select from "@/components/forms/Select";
import { newInitialState, useStateToastNotifications } from "@/components/forms/useStateToastNotifications";
import { OrdenCompra, Proveedor } from "@/lib/queries/shared";
import { formatForInput } from "@/lib/queries/utils";
import { useState } from "react";
import { useFormState } from "react-dom";
import { ToastContainer } from "react-toastify";
import { bindEditarOrdenCompra } from "./page";

const initialState = newInitialState();

interface Props {
    orden: OrdenCompra;
    proveedores: Proveedor[];
    onSubmit: ReturnType<typeof bindEditarOrdenCompra>;
}

export default function Form({ orden, proveedores, onSubmit }: Props) {
    const [state, formAction] = useFormState(onSubmit, initialState);

    const [proveedorId, setProveedorId] = useState(orden.proveedorId);
    const [fecha, setFecha] = useState(formatForInput(orden.fecha));

    useStateToastNotifications(state)

    return (
        <form id="form-data" action={formAction} method="post">
            <ToastContainer />

            <div className="card-body">
                <div className="card-title">
                    Orden #<em>{orden.id}</em>
                </div>

                <FormError message={state?.messages?.error} />

                <Select
                    name="proveedorId"
                    label="Proveedor"
                    selected={proveedorId}
                    onSelectChanged={(id) => setProveedorId(id)}
                    value={proveedorId}
                    errors={state?.errors?.proveedorId}
                    options={proveedores}
                    text={(proveedor) => proveedor.nombre}
                    option={(proveedor, index) => proveedor.nombre}
                    optionValue={(c) => c.id}
                />
                <Input
                    name="fecha"
                    label="Fecha (formato: 2024-12-31)"
                    value={fecha}
                    onChange={(ev) => setFecha(ev.target.value)}
                    errors={state?.errors?.fecha}
                />

                <div className="card-actions justify-end">
                    <button type="submit" className="btn btn-primary">
                        Editar
                    </button>
                    <button className="btn btn-ghost">Cancelar</button>
                </div>
            </div>
        </form>
    );
}
