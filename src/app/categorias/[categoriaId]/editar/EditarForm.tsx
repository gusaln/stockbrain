"use client";

import Input from "@/components/forms/Input";
import Textarea from "@/components/forms/Textarea";
import { Categoria } from "@/lib/queries";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { ToastContainer, toast } from "react-toastify";
import { bindCategoriaId } from "./page";

const initialState = {
    message: "",
    errors: null,
};

interface Props {
    categoria: Categoria;
    onSubmit: ReturnType<typeof bindCategoriaId>;
}

export default function Form({ categoria, onSubmit }: Props) {
    const [state, formAction] = useFormState(onSubmit, initialState);

    const [nombre, setNombre] = useState(categoria.nombre);
    const [descripcion, setDescripcion] = useState(categoria.descripcion);

    useEffect(() => {
        if (state.message) {
            toast.error(state.message);
        }
    }, [state]);

    return (
        <form action={formAction} method="post">
            <ToastContainer />

            <div className="card-body">
                <div className="card-title">
                    Categoría <em>{categoria.nombre}</em>
                </div>

                <p aria-live="polite" className="sr-only">
                    {state?.message}
                </p>

                <Input
                    name="nombre"
                    label="Nombre"
                    onChange={(ev) => setNombre(ev.target.value)}
                    value={nombre}
                    errors={state.errors?.nombre}
                />
                <Textarea
                    name="descripcion"
                    label="Descripción"
                    onChange={(ev) => setDescripcion(ev.target.value)}
                    value={descripcion}
                    errors={state.errors?.descripcion}
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
