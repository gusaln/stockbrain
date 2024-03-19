"use client";

import { FormError } from "@/components/forms/FormError";
import Input from "@/components/forms/Input";
import Textarea from "@/components/forms/Textarea";
import { newInitialState, useStateToastNotifications } from "@/components/forms/useStateToastNotifications";
import { OrdenConsumo } from "@/lib/queries/shared";
import { formatForInput } from "@/lib/queries/utils";
import { useState } from "react";
import { useFormState } from "react-dom";
import { ToastContainer } from "react-toastify";
import { bindEditarOrdenConsumo } from "./page";

const initialState = newInitialState();

interface Props {
    orden: OrdenConsumo;
    onSubmit: ReturnType<typeof bindEditarOrdenConsumo>;
}

export default function Form({ orden, onSubmit }: Props) {
    const [state, formAction] = useFormState(onSubmit, initialState);

    const [descripcion, setDescripcionId] = useState(orden.descripcion);
    const [fecha, setFecha] = useState(formatForInput(orden.fecha));

    useStateToastNotifications(state);

    return (
        <form id="form-data" action={formAction} method="post">
            <ToastContainer />

            <div className="card-body">
                <div className="card-title">
                    Orden #<em>{orden.id}</em>
                </div>

                <FormError message={state?.messages?.error} />

                <Input
                    name="fecha"
                    label="Fecha (formato: 2024-12-31)"
                    value={fecha}
                    onChange={(ev) => setFecha(ev.target.value)}
                    errors={state?.errors?.fecha}
                />
                <Textarea
                    name="descripcion"
                    label="Descripción"
                    value={descripcion}
                    onChange={(ev) => setDescripcionId(ev.target.value)}
                    errors={state?.errors?.descripcion}
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
