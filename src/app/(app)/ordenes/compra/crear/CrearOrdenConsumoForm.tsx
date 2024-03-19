"use client";

import { FormError } from "@/components/forms/FormError";
import Input from "@/components/forms/Input";
import Select from "@/components/forms/Select";
import { Almacen, Producto, Proveedor } from "@/lib/queries/shared";
import { PlusCircleIcon } from "@heroicons/react/16/solid";
import { uniqueId } from "lodash";
import { useState } from "react";
import { useFormState } from "react-dom";
import { crearOrdenConsumo } from "./action";

const initialState = {
    message: "",
    errors: null,
};

interface Props {
    proveedores: Proveedor[];
    almacenes: Almacen[];
    productos: Producto[];
    onSubmit: typeof crearOrdenConsumo;
}

interface Item {
    _id: string;
    almacenId: number;
    productoId: number;
    cantidad: number;
    precioUnitario: number;
}

export default function Form(props: Props) {
    const [state, formAction] = useFormState(props.onSubmit, initialState);

    const [proveedorId, setProveedorId] = useState(undefined as number | undefined);

    const [items, setItems] = useState([] as Item[]);

    function handleItemAdd() {
        setItems([
            ...items,
            {
                _id: uniqueId(),
                almacenId: props.almacenes.length == 1 ? props.almacenes[0].id : null,
                productoId: 0,
                cantidad: "",
            },
        ]);
    }

    function handleItemChange(item: Item, changed: Partial<Item>) {
        setItems(
            items.map((i) => {
                if (i._id == item._id) {
                    return { ...i, ...changed, _id: i._id };
                }

                return { ...i };
            }),
        );
    }

    return (
        <form action={formAction} method="post">
            <div className="card-body">
                <div className="card-title">Indique los datos de la orden de consumo</div>

                <FormError message={state.message} />

                <Select
                    name="proveedorId"
                    label="Proveedor"
                    selected={proveedorId}
                    onSelectChanged={(id) => setProveedorId(id)}
                    value={proveedorId}
                    errors={state.errors?.proveedorId}
                    options={props.proveedores}
                    text={(proveedor) => proveedor.nombre}
                    option={(proveedor, index) => proveedor.nombre}
                    optionValue={(c) => c.id}
                />
                <Input name="fecha" label="Fecha (formato: 2024-12-31)" errors={state.errors?.fecha} />

                <input name="__itemCount" value={items.length} type="hidden" />

                <ul>
                    {items.map((item, index) => {
                        return (
                            <li className="grid grid-cols-4 gap-2" key={item._id}>
                                <Select
                                    name={`items[${index}].almacenId`}
                                    label="Almacén"
                                    selected={item.almacenId}
                                    onSelectChanged={(id) => handleItemChange(item, { almacenId: id })}
                                    options={props.almacenes}
                                    text={(almacen) => almacen.nombre}
                                    option={(almacen, index) => almacen.nombre}
                                    optionValue={(p) => p.id}
                                    errors={state.errors?.items}
                                />

                                <Select
                                    name={`items[${index}].productoId`}
                                    label="Producto"
                                    selected={item.productoId}
                                    onSelectChanged={(id) => handleItemChange(item, { productoId: id })}
                                    value={item.productoId}
                                    options={props.productos}
                                    text={(producto) => `${producto.modelo} | ${producto.marca}`}
                                    option={(producto, index) => `${producto.modelo} | ${producto.marca}`}
                                    optionValue={(c) => c.id}
                                    errors={state.errors?.items}
                                />

                                <Input
                                    name={`items[${index}].cantidad`}
                                    label="Cantidad"
                                    type="number"
                                    value={item.cantidad}
                                    onChange={(ev) => handleItemChange(item, { cantidad: ev.target.value })}
                                    errors={state.errors?.items}
                                />
                            </li>
                        );
                    })}

                    <li>
                        <button
                            className="btn btn-sm btn-ghost space-x-2"
                            onClick={(ev) => {
                                ev.preventDefault();
                                handleItemAdd();
                            }}
                        >
                            <PlusCircleIcon width="16" /> Agregar item
                        </button>
                    </li>
                </ul>

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
