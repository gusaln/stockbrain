"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { crearAjuste } from "./action";
import Input from "@/components/forms/Input";

const initialState = {
    message: "",
    errors: null
};

interface Props {
    onSubmit: typeof crearAjuste;
}

export default function Form(props: Props) {
    const [state, formAction] = useFormState(props.onSubmit, initialState);

    return (
        <form action={formAction} method="post">
            <div className="card-body">
                <div className="card-title">Indique los datos del nuevo ajuste de inventario</div>

                <p aria-live="polite" className="sr-only">
                    {state?.message}
                </p>

                <Input type="date" name="fecha" label="Fecha" errors={state.errors?.fecha} />
                <Input name="almacen" label="Almacén" errors={state.errors?.almacen} />
                <Input name="producto" label="Producto" errors={state.errors?.producto} />
                <Input name="tipo" label="Tipo" errors={state.errors?.tipo} />
                <Input name="cantidad" label="Cantidad" errors={state.errors?.cantidad} />
                <Input name="motivo" label="Motivo" errors={state.errors?.motivo} />


                <div className="card-actions justify-end">
                    <button type="submit" className="btn btn-primary">
                        Crear
                    </button>
                    <button className="btn btn-ghost">Cancelar</button>
                </div>
            </div>
        </form>
    );
}
