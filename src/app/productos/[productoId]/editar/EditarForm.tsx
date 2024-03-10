"use client";

import Input from "@/components/forms/Input";
import Textarea from "@/components/forms/Textarea";
import { Producto } from "@/lib/queries";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { ToastContainer, toast } from "react-toastify";
import { bindProductoId } from "./page";

const initialState = {
    message: "",
    errors: null,
};

interface Props {
    producto: Producto;
    onSubmit: ReturnType<typeof bindProductoId>;
}

export default function Form({ producto, onSubmit }: Props) {
    const [state, formAction] = useFormState(onSubmit, initialState);

    const [categoriaId, setCategoriaId] = useState(producto.categoriaId);
    const [marca, setMarca ] = useState(producto.marca);
    const [modelo, setModelo ] = useState(producto.modelo);
    const [descripcion, setDescripcion] = useState(producto.descripcion);
    const [imagen, setImagen ] = useState(producto.imagen);

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
                    Producto <em>{producto.categoriaId}</em>
                </div>

                <p aria-live="polite" className="sr-only">
                    {state?.message}
                </p>

                <Input
                    name="categoriaId"
                    label="Id de categoría"
                    onChange={(ev) => setCategoriaId(ev.target.value)}
                    value={categoriaId}
                    errors={state.errors?.categoriaId}
                />
                <Input
                    name="marca"
                    label="Marca"
                    onChange={(ev) => setMarca(ev.target.value)}
                    value={marca}
                    errors={state.errors?.marca}
                />
                <Input
                    name="modelo"
                    label="Modelo"
                    onChange={(ev) => setModelo(ev.target.value)}
                    value={modelo}
                    errors={state.errors?.modelo}
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
