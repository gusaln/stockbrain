"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { crearProducto } from "./action";
import Input from "@/components/forms/Input";

const initialState = {
    message: "", 
    errors: null
};

interface Props {
    onSubmit: typeof crearProducto;
}

export default function Form(props: Props) {
    const [state, formAction] = useFormState(props.onSubmit, initialState);

    return (
        <form action={formAction} method="post">
            <div className="card-body">
                <div className="card-title">Indique los datos del producto</div>
                <p aria-live="polite" className="sr-only">
                    {state?.message}
                </p>
                <Input name="categoriaId" label="Id de la Categoria" errors={state.errors?.categoriaId} />
                <Input name="marca" label="Marca" errors={state.errors?.marca}/>
                <Input name="modelo" label="Modelo" errors={state.errors?.modelo}/>
                <Input name="descripcion" label="Descripción" errors={state.errors?.descripcion}/>
                <Input name="imagen" label="Imagen" errors={state.errors?.imagen}/>
           
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