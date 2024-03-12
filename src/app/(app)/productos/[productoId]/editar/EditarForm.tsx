"use client";

import Input from "@/components/forms/Input";
import Textarea from "@/components/forms/Textarea";
import { Categoria, Producto } from "@/lib/queries";
import { useEffect, useMemo, useState } from "react";
import { useFormState } from "react-dom";
import { ToastContainer, toast } from "react-toastify";
import { bindProductoId } from "./page";
import Select from "@/components/forms/Select";

const initialState = {
    message: "",
    errors: null,
};

interface Props {
    producto: Producto;
    categorias: Categoria[];
    onSubmit: ReturnType<typeof bindProductoId>;
}

export default function Form({ producto, categorias, onSubmit }: Props) {
    const [state, formAction] = useFormState(onSubmit, initialState);

    const [categoriaId, setCategoriaId] = useState(producto.categoriaId);
    const [marca, setMarca] = useState(producto.marca);
    const [modelo, setModelo] = useState(producto.modelo);
    const [descripcion, setDescripcion] = useState(producto.descripcion);
    const [imagen, setImagen] = useState(producto.imagen);

    useEffect(() => {
        if (state.message) {
            toast.error(state.message);
        }
    }, [state]);

    return (
        <form id="form-data" action={formAction} method="post">
            <ToastContainer />

            <div className="card-body">
                <div className="card-title">
                    Producto <em>{producto.marca} - {producto.modelo}</em>
                </div>

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
