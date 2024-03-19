"use client";

import { FormError } from "@/components/forms/FormError";
import Input from "@/components/forms/Input";
import { ProductoEstadoCheckbox } from "@/components/forms/ProductoEstadosCheckbox";
import Select from "@/components/forms/Select";
import { Almacen, Producto } from "@/lib/queries/shared";
import { useState } from "react";
import { useFormState } from "react-dom";
import { crearAjuste } from "./action";
// import { AJUSTE_INVENTARIO_TIPO } from "@/lib/queries";

const initialState = {
    message: "",
    errors: null,
};

interface Props {
    almacenes: Almacen[];
    productos: Producto[];
    onSubmit: typeof crearAjuste;
}

export default function Form(props: Props) {
    const [state, formAction] = useFormState(props.onSubmit, initialState);

    const [almacenId, setAlmacenId] = useState(props.almacenes.length == 1 ? props.almacenes[0].id : null);
    const [productoId, setProductoId] = useState(null as number | null);

    return (
        <form action={formAction} method="post">
            <div className="card-body w-full">
                <div className="card-title">Indique los datos del nuevo ajuste de inventario</div>

                <FormError message={state.message} />

                <Input name="fecha" label="Fecha (formato: 2024-12-31)" errors={state.errors?.fecha} />

                <Select
                    name="almacenId"
                    label="almacen"
                    selected={almacenId}
                    onSelectChanged={(pId) => setAlmacenId(pId)}
                    errors={state.errors?.almacenId}
                    options={props.almacenes}
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
                    options={props.productos}
                    text={(producto) => `${producto.marca} ${producto.modelo}`}
                    option={(producto, index) => `${producto.marca} ${producto.modelo}`}
                    optionValue={(p) => p.id}
                />

                <ProductoEstadoCheckbox name="estado" />

                <div className="form-control">
                    <label className="label cursor-pointer">
                        <span className="label-text">Entrada</span>
                        <input type="radio" name="tipo" className="radio checked:bg-blue-500" checked value={1} />
                    </label>
                </div>
                <div className="form-control">
                    <label className="label cursor-pointer">
                        <span className="label-text">Salida</span>
                        <input type="radio" name="tipo" className="radio checked:bg-red-500" checked value={2} />
                    </label>
                    <div className="label">
                        {state.errors?.tipo ? (
                            <span className="label-text-alt text-red-400">{state.errors?.tipo}</span>
                        ) : (
                            state.errors?.tipo
                        )}
                    </div>
                </div>
                <Input name="cantidad" label="Cantidad" errors={state.errors?.cantidad} type="number" />
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
