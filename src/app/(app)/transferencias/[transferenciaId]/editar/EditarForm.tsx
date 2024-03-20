"use client";

import { FormError } from "@/components/forms/FormError";
import Input from "@/components/forms/Input";
import Select from "@/components/forms/Select";
import Textarea from "@/components/forms/Textarea";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { ToastContainer, toast } from "react-toastify";
import { bindEditarTransferencia } from "./page";
import { AjusteInventario, Almacen, Producto, ProductoEstado, Transferencia } from "@/lib/queries/shared";
import { ProductoEstadoCheckbox } from "@/components/forms/ProductoEstadosCheckbox";
import { formatForInput } from "@/lib/queries/utils";
import { newInitialState, useStateToastNotifications } from "@/components/forms/useStateToastNotifications";

const initialState = newInitialState();

interface Props {
    transferencia: Transferencia;
    almacenes: Almacen[];
    productos: Producto[];
    onSubmit: ReturnType<typeof bindEditarTransferencia>;
}

export default function Form({ transferencia, productos, almacenes, onSubmit }: Props) {
    const [state, formAction] = useFormState(onSubmit, initialState);

    const [fecha, setFecha] = useState(formatForInput(transferencia.fecha));
    const [almacenOrigenId, setAlmacenOrigenId] = useState(transferencia.almacenOrigenId as number);
    const [almacenDestinoId, setAlmacenDestinoId] = useState(transferencia.almacenDestinoId);
    const [productoId, setProductoId] = useState(transferencia.productoId);
    const [estadoOrigen, setEstadoOrigen] = useState(transferencia.estadoOrigen as ProductoEstado);
    const [estadoDestino, setEstadoDestino] = useState(transferencia.estadoDestino);
    const [cantidad, setCantidad] = useState(transferencia.cantidad);

    useStateToastNotifications(state);

    return (
        <form action={formAction} method="post">
            <ToastContainer />

            <div className="card-body">
                <div className="card-title">
                    Transferencia <em>#{transferencia.id}</em>
                </div>

                <FormError message={state?.messages?.error} />

                <Input
                    name="fecha"
                    label="Fecha (formato: 2024-12-31)"
                    onChange={(ev) => setFecha(ev.target.value)}
                    value={fecha}
                    errors={state?.errors?.fecha}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Select
                        name="almacenOrigenId"
                        label="Almacén Origen"
                        selected={almacenOrigenId}
                        onSelectChanged={(id) => setAlmacenOrigenId(id)}
                        errors={state.errors?.almacenOrigenId}
                        options={almacenes}
                        text={(almacen) => almacen.nombre}
                        option={(almacen, index) => almacen.nombre}
                        optionValue={(p) => p.id}
                    />

                    <Select
                        name="almacenDestinoId"
                        label="Almacén Destino"
                        selected={almacenDestinoId}
                        onSelectChanged={(id) => setAlmacenDestinoId(id)}
                        errors={state.errors?.almacenDestinoId}
                        options={almacenes}
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
                    errors={state?.errors?.productoId}
                    options={productos}
                    text={(producto) => `${producto.marca} ${producto.modelo}`}
                    option={(producto, index) => `${producto.marca} ${producto.modelo}`}
                    optionValue={(p) => p.id}
                />

                <div>
                    <div>Estado Origen</div>
                    <ProductoEstadoCheckbox
                        name="estadoOrigen"
                        value={estadoOrigen}
                        onSelect={(estado) => setEstadoOrigen(estado)}
                    />
                </div>
                <div>
                    <div>Estado Destino</div>
                    <ProductoEstadoCheckbox
                        name="estadoDestino"
                        value={estadoDestino}
                        onSelect={(estado) => setEstadoDestino(estado)}
                    />
                </div>

                <Input
                    type="number"
                    name="cantidad"
                    label="Cantidad"
                    onChange={(ev) => setCantidad(ev.target.value)}
                    value={cantidad}
                    errors={state?.errors?.cantidad}
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
