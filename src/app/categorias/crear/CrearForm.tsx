"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { crearCategoria } from "./action";
import Input from "@/components/forms/Input";

const initialState = {
    message: "",
    errors: null
};

interface Props {
    onSubmit: typeof crearCategoria;
}

export default function Form(props: Props) {
    const [state, formAction] = useFormState(props.onSubmit, initialState);

    return (
        <form action={formAction} method="post">
            <div className="card-body">
                <div className="card-title">Indique los datos de la nueva categoría</div>

                <p aria-live="polite" className="sr-only">
                    {state?.message}
                </p>

                <Input name="nombre" label="Nombre" errors={state.errors?.nombre} />
                <Input name="descripcion" label="Persona de descripción"  errors={state.errors?.descripcion}/>


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
