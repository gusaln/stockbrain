"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { crearProducto } from "./action";
import Input from "@/components/forms/Input";
import Select from "@/components/forms/Select";
import { Categoria } from "@/lib/queries/shared";

const initialState = {
    message: "", 
    errors: null
};

interface Props {
    categorias: Categoria[];
    onSubmit: typeof crearProducto;
}

export default function Form({categorias, onSubmit}: Props) {
    const [state, formAction] = useFormState(onSubmit, initialState);

    const [categoriaId, setCategoriaId] = useState(undefined as number | undefined);


    return (
        <form action={formAction} method="post">
            <div className="card-body">
                <div className="card-title">Indique los datos del producto</div>
                <p aria-live="polite" className="sr-only">
                    {state?.message}
                </p>
                <Select
                    name="categoriaId"
                    label="Categoría"
                    selected={categoriaId}
                    onSelectChanged={(id) => setCategoriaId(id)}
                    // onChange={(ev) => setCategoriaId(ev.target.value)}
                    value={categoriaId}
                    errors={state.errors?.categoriaId}
                    options={categorias}
                    text={(categoria) => categoria.nombre}
                    option={(categoria, index) => categoria.nombre}
                    optionValue={(c) => c.id}
                />
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