"use client";

import Input from "@/components/forms/Input";
import Textarea from "@/components/forms/Textarea";
import { AjusteInventario } from "@/lib/queries";
import { Almacen } from "@/lib/queries";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { ToastContainer, toast } from "react-toastify";
import { bindAjusteId } from "./page";
import Select from "@/components/forms/Select";

const initialState = {
    message: "",
    errors: null,
};

interface Props {
    ajuste: AjusteInventario;
    almacenes: Almacen;
    onSubmit: ReturnType<typeof bindAjusteId>;
}

export default function Form({ ajuste, almacenes, onSubmit }: Props) {
    const [state, formAction] = useFormState(onSubmit, initialState);

    const [fecha, setFecha] = useState(ajuste.fecha);
    const [almacenId, setAlmacenId] = useState(ajuste.almacenId);
    const [productoId, setProductoId] = useState(ajuste.productoId);
    const [tipo, setTipo] = useState(ajuste.tipo);
    const [cantidad, setCantidad] = useState(ajuste.cantidad);
    const [motivo, setMotivo] = useState(ajuste.motivo);

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
                    Ajuste <em>{ajuste.id}</em>
                </div>

                <p aria-live="polite" className="sr-only">
                    {state?.message}
                </p>

                <Input
                    type="date"
                    name="fecha"
                    label="Fecha"
                    onChange={(ev) => setFecha(ev.target.value)}
                    value={fecha}
                    errors={state.errors?.fecha}
                />

                <Select
                    name="almacenId"
                    label="ID Almacén"
                    options={almacenes.map((almacen) => ({
                        value: almacen.id,
                        label: almacen.name,
                    }))}
                    onChange={(ev) => setAlmacenId(ev.target.value)}
                    value={almacenId}
                    errors={state.errors?.almacenId}
                />

                <Input //Search
                    type="number"
                    name="productoId"
                    label="ID Producto"
                    onChange={(ev) => setProductoId(ev.target.value)}
                    value={productoId}
                    errors={state.errors?.productoId}
                />

                <Select
                    name="tipo"
                    label="Tipo"
                    options={[
                        { value: 1, label: "Entrada" },
                        { value: 2, label: "Salida" },
                    ]}
                    onChange={(ev) => setTipo(Number(ev.target.value))}
                    value={tipo}
                    errors={state.errors?.tipo}
                />

                <Input
                    type="number"
                    name="cantidad"
                    label="Cantidad"
                    onChange={(ev) => setCantidad(Number(ev.target.value))}
                    value={cantidad}
                    errors={state.errors?.cantidad}
                />

                <Textarea
                    name="motivo"
                    label="Motivo"
                    onChange={(ev) => setMotivo(ev.target.value)}
                    value={motivo}
                    errors={state.errors?.motivo}
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
