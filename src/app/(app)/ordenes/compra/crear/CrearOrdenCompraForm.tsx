"use client";

import Input from "@/components/forms/Input";
import Select from "@/components/forms/Select";
import { Producto, Proveedor } from "@/lib/queries/shared";
import { PlusCircleIcon } from "@heroicons/react/16/solid";
import { uniqueId } from "lodash";
import { useState } from "react";
import { useFormState } from "react-dom";
import { crearOrdenCompra } from "./action";
import { FormError } from "@/components/forms/FormError";
import DatePickerInput from "@/components/forms/DatePickerInput";

const initialState = {
    message: "",
    errors: null,
};

interface Props {
    proveedores: Proveedor[];
    productos: Producto[];
    onSubmit: typeof crearOrdenCompra;
}

interface Item {
    _id: string;
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
                productoId: 0,
                cantidad: "",
                precioUnitario: "",
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
                <div className="card-title">Indique los datos de la orden de compra</div>

                <FormError message={state.message}/>

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
                <Input name="fecha" label="Fecha (formato: 2024-12-31)" errors={state.errors?.fecha}  />

                <input name="__itemCount" value={items.length} type="hidden" />

                <ul>
                    {items.map((item, index) => {
                        return (
                            <li className="grid grid-cols-4 gap-2" key={item._id}>
                                <Select
                                    name={`items[${index}].productoId`}
                                    label="Producto"
                                    selected={item.productoId}
                                    onSelectChanged={(id) => handleItemChange(item, { productoId: id })}
                                    // onChange={(ev) => setCategoriaId(ev.target.value)}
                                    value={item.productoId}
                                    options={props.productos}
                                    text={(producto) => `${producto.marca} | ${producto.modelo}`}
                                    option={(producto, index) => `${producto.marca} | ${producto.modelo}`}
                                    optionValue={(c) => c.id}
                                />

                                <Input
                                    name={`items[${index}].cantidad`}
                                    label="Cantidad"
                                    type="number"
                                    value={item.cantidad}
                                    onChange={(ev) => handleItemChange(item, { cantidad: ev.target.value })}
                                    errors={state.errors?.items}
                                />

                                <Input
                                    name={`items[${index}].precioUnitario`}
                                    label="Precio por Unidad"
                                    type="number"
                                    value={item.precioUnitario}
                                    onChange={(ev) => handleItemChange(item, { precioUnitario: ev.target.value })}
                                    errors={state.errors?.items}
                                />

                                <Input label="Total" value={item.cantidad * item.precioUnitario} />
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
