"use client";

import { FormError } from "@/components/forms/FormError";
import Input from "@/components/forms/Input";
import { ProductoEstadoCheckbox } from "@/components/forms/ProductoEstadosCheckbox";
import Select from "@/components/forms/Select";
import { Almacen, Producto } from "@/lib/queries/shared";
import { useState } from "react";
import { useFormState } from "react-dom";
import { crearTransferencia } from "./action";
import { newInitialState } from "@/components/forms/useStateToastNotifications";

const initialState = newInitialState();

interface Props {
    almacenes: Almacen[];
    productos: Producto[];
    onSubmit: typeof crearTransferencia;
}

export default function Form(props: Props) {
    const [state, formAction] = useFormState(props.onSubmit, initialState);

    const [almacenOrigenId, setAlmacenOrigenId] = useState(props.almacenes.length == 1 ? props.almacenes[0].id : null);
    const [almacenDestinoId, setAlmacenDestinoId] = useState(
        props.almacenes.length == 1 ? props.almacenes[0].id : null,
    );
    const [productoId, setProductoId] = useState(null as number | null);

    return (
        <form action={formAction} method="post">
            <div className="card-body w-full">
                <div className="card-title">Indique los datos de la transferencia</div>

                <FormError message={state?.messages?.error} />

                <Input name="fecha" label="Fecha (formato: 2024-12-31)" errors={state.errors?.fecha} />

                <div className="grid grid-cols-2 gap-4">
                    <Select
                        name="almacenOrigenId"
                        label="Almacén Origen"
                        selected={almacenOrigenId}
                        onSelectChanged={(pId) => setAlmacenOrigenId(pId)}
                        errors={state.errors?.almacenOrigenId}
                        options={props.almacenes}
                        text={(almacen) => almacen.nombre}
                        option={(almacen, index) => almacen.nombre}
                        optionValue={(p) => p.id}
                    />

                    <Select
                        name="almacenDestinoId"
                        label="Almacén Destino"
                        selected={almacenDestinoId}
                        onSelectChanged={(pId) => setAlmacenDestinoId(pId)}
                        errors={state.errors?.almacenDestinoId}
                        options={props.almacenes}
                        text={(almacen) => almacen.nombre}
                        option={(almacen, index) => almacen.nombre}
                        optionValue={(p) => p.id}
                    />
                </div>

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

                <div>
                    <div>Estado Origen</div>
                    <ProductoEstadoCheckbox name="estadoOrigen" />
                </div>
                <div>
                    <div>Estado Destino</div>
                    <ProductoEstadoCheckbox name="estadoDestino" />
                </div>

                <Input name="cantidad" label="Cantidad" errors={state.errors?.cantidad} type="number" />

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
