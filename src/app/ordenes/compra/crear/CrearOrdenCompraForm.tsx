"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { crearOrdenCompra } from "./action";
import Input from "@/components/forms/Input";

const initialState = {
    message: "",
    errors: null
};

interface Props {
    onSubmit: typeof crearOrdenCompra;
}

export default function Form(props: Props) {
    const [state, formAction] = useFormState(props.onSubmit, initialState);

    return (
        <form action={formAction} method="post">
            <div className="card-body">
                <div className="card-title">Indique los datos de la orden de compra</div>

                <p aria-live="polite" className="sr-only">
                    {state?.message}
                </p>

                <Input name="proveedorId" label="ID Proveedor" errors={state.errors?.proveedorId} />
                <Input name="fecha" label="Fecha" type="date" errors={state.errors?.fecha}/>
                <Input name="operadorId" label="ID Operador" errors={state.errors?.operadorId}/>

                <div className="card-actions justify-end">
                    <button type="submit" className="btn btn-primary">
                        Registrar
                    </button>
                    <button className="btn btn-ghost">Cancelar</button>
                </div>
            </div>
        </form>
    );
}