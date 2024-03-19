"use client";

import { FormError } from "@/components/forms/FormError";
import Input from "@/components/forms/Input";
import Select from "@/components/forms/Select";
import { useStateToastNotifications } from "@/components/forms/useStateToastNotifications";
import { Almacen, OrdenConsumo, Producto } from "@/lib/queries/shared";
import { useState } from "react";
import { useFormState } from "react-dom";
import { ToastContainer } from "react-toastify";
import { bindCrearOrdenConsumo } from "./page";

const initialState = {
    message: "",
    errors: null,
};

interface Props {
    orden: OrdenConsumo;
    almacenes: Almacen[];
    productos: Producto[];
    onSubmit: ReturnType<typeof bindCrearOrdenConsumo>;
}

export default function CrearItemForm({ orden, almacenes, productos, onSubmit }: Props) {
    const [state, formAction] = useFormState(onSubmit, initialState);

    const [almacenId, setAlmacenId] = useState(almacenes.length == 1 ? almacenes[0].id : null);
    const [productoId, setProductoId] = useState(-1);
    const [cantidad, setCantidad] = useState(0);
    function handleCancelar() {
        setAlmacenId(-1);
        setProductoId(-1);
        setCantidad(0);
    }

    useStateToastNotifications(state);

    return (
        <form id="form-data" action={formAction} method="post">
            <ToastContainer />

            <div className="card-body">
                <div className="card-title">
                    Agregar Item a Orden #<em>{orden.id}</em>
                </div>

                <FormError message={state?.messages?.error} />

                <div className="grid grid-cols-4 gap-2">
                    <Select
                        name="almacenId"
                        label="Almacén"
                        selected={almacenId}
                        onSelectChanged={(id) => setAlmacenId(id)}
                        options={almacenes}
                        text={(almacen) => almacen.nombre}
                        option={(almacen, index) => almacen.nombre}
                        optionValue={(p) => p.id}
                        errors={state?.errors?.almacenId}
                    />

                    <Select
                        name="productoId"
                        label="Producto"
                        selected={productoId}
                        onSelectChanged={(id) => setProductoId(id)}
                        options={productos}
                        text={(producto) => `${producto.modelo} | ${producto.marca}`}
                        option={(producto, index) => `${producto.modelo} | ${producto.marca}`}
                        optionValue={(c) => c.id}
                        errors={state?.errors?.productoId}
                    />

                    <Input
                        name="cantidad"
                        label="Cantidad"
                        type="number"
                        value={cantidad}
                        onChange={(ev) => setCantidad(parseFloat(ev.target.value))}
                        errors={state?.errors?.cantidad}
                    />
                </div>

                <div className="card-actions justify-end">
                    <button type="submit" className="btn btn-primary">
                        Crear
                    </button>
                    <button className="btn btn-ghost" onClick={handleCancelar}>
                        Cancelar
                    </button>
                </div>
            </div>
        </form>
    );
}
