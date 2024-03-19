"use client";

import { FormError } from "@/components/forms/FormError";
import Input from "@/components/forms/Input";
import Select from "@/components/forms/Select";
import Textarea from "@/components/forms/Textarea";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { ToastContainer, toast } from "react-toastify";
import { bindAjusteId } from "./page";
import { AjusteInventario, Almacen, Producto } from "@/lib/queries/shared";
import { ProductoEstadoCheckbox } from "@/components/forms/ProductoEstadosCheckbox";

const initialState = {
    message: "",
    errors: null,
};

interface Props {
    ajuste: AjusteInventario;
    almacenes: Almacen[];
    productos: Producto[];
    onSubmit: ReturnType<typeof bindAjusteId>;
}

export default function Form({ ajuste, productos, almacenes, onSubmit }: Props) {
    const [state, formAction] = useFormState(onSubmit, initialState);

    const [fecha, setFecha] = useState(ajuste.fecha);
    const [almacenId, setAlmacenId] = useState(ajuste.almacenId);
    const [productoId, setProductoId] = useState(ajuste.productoId);
    const [estado, setEstado] = useState(ajuste.estado);
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

                <FormError message={state.message} />

                <Input
                    name="fecha"
                    label="Fecha (formato: 2024-12-31)"
                    onChange={(ev) => setFecha(ev.target.value)}
                    value={fecha}
                    errors={state.errors?.fecha}
                />

                <Select
                    name="almacenId"
                    label="almacen"
                    selected={almacenId}
                    onSelectChanged={(pId) => setAlmacenId(pId)}
                    errors={state.errors?.almacenId}
                    options={almacenes}
                    text={(almacen) => almacen.nombre}
                    option={(almacen, index) => almacen.nombre}
                    optionValue={(p) => p.id}
                />

                <Select
                    name="productoId"
                    label="Producto"
                    selected={productoId}
                    onSelectChanged={(pId) => setProductoId(pId)}
                    errors={state.errors?.productoId}
                    options={productos}
                    text={(producto) => `${producto.marca} ${producto.modelo}`}
                    option={(producto, index) => `${producto.marca} ${producto.modelo}`}
                    optionValue={(p) => p.id}
                />

                <ProductoEstadoCheckbox name="estado"
                    value={estado}
                    onSelect={(estado) => setEstado(estado)}
                />

                <div className="form-control">
                    <label className="label cursor-pointer">
                        <span className="label-text">Entrada</span>
                        <input
                            type="radio"
                            name="tipo"
                            className="radio checked:bg-blue-500"
                            checked={tipo == 1}
                            value={1}
                            onChange={(ev) => setTipo(ev.target.value)}
                        />
                    </label>
                </div>
                <div className="form-control">
                    <label className="label cursor-pointer">
                        <span className="label-text">Salida</span>
                        <input
                            type="radio"
                            name="tipo"
                            className="radio checked:bg-red-500"
                            checked={tipo == 2}
                            value={2}
                        />
                    </label>
                    <div className="label">
                        {state.errors?.tipo ? (
                            <span className="label-text-alt text-red-400">{state.errors?.tipo}</span>
                        ) : (
                            state.errors?.tipo
                        )}
                    </div>
                </div>

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
