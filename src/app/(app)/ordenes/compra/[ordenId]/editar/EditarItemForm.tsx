"use client";

import { FormError } from "@/components/forms/FormError";
import Input from "@/components/forms/Input";
import Select from "@/components/forms/Select";
import { Almacen, OrdenCompraItem, Producto } from "@/lib/queries/shared";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { ToastContainer, toast } from "react-toastify";
import { bindBorrarOrdenCompraItem, bindEditarOrdenCompraItem } from "./page";
import { newInitialState, useStateToastNotifications } from "@/components/forms/useStateToastNotifications";

const initialState = newInitialState();

interface Props {
    item: OrdenCompraItem;
    almacenes: Almacen[];
    productos: Producto[];
    onEditar: ReturnType<typeof bindEditarOrdenCompraItem>;
    onBorrar: ReturnType<typeof bindBorrarOrdenCompraItem>;
}

export default function EditarItemForm({ item, almacenes, productos, onEditar, onBorrar }: Props) {
    const [editarState, editarFormAction] = useFormState(onEditar, { ...initialState });
    const [borraState, borrarFormAction] = useFormState(onBorrar, { ...initialState });

    const [almacenId, setAlmacenId] = useState(item.almacenId);
    const [productoId, setProductoId] = useState(item.productoId);
    const [cantidad, setCantidad] = useState(item.cantidad);
    const [precio, setPrecio] = useState(item.precioUnitario);

    const [isDeleting, setIsDeleting] = useState(false);

    function handleCancelar() {
        setAlmacenId(item.almacenId);
        setProductoId(item.productoId);
        setCantidad(item.cantidad);
        setPrecio(item.precioUnitario);
    }

    useStateToastNotifications(editarState);
    useStateToastNotifications(borraState);

    return (
        <div>
            <ToastContainer />

            <div className="card-body">
                <form id="form-data" action={editarFormAction} method="post">
                    <div className="card-title">Editar Item</div>

                    <FormError message={editarState?.messages?.error} />

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
                            errors={editarState?.errors?.almacenId}
                        />

                        <Select
                            name="productoId"
                            label="Producto"
                            selected={productoId}
                            onSelectChanged={(id) => setProductoId(id)}
                            value={productoId}
                            options={productos}
                            text={(producto) => `${producto.modelo} | ${producto.marca}`}
                            option={(producto, index) => `${producto.modelo} | ${producto.marca}`}
                            optionValue={(c) => c.id}
                            errors={editarState?.errors?.productoId}
                        />

                        <Input
                            name="cantidad"
                            label="Cantidad"
                            type="number"
                            value={cantidad}
                            onChange={(ev) => setCantidad(parseFloat(ev.target.value))}
                            errors={editarState?.errors?.cantidad}
                        />

                        <Input
                            name="precioUnitario"
                            label="Precio por Unidad"
                            type="number"
                            value={precio}
                            onChange={(ev) => setPrecio(parseFloat(ev.target.value))}
                            errors={editarState?.errors?.precioUnitario}
                        />

                        <Input label="Total" readOnly value={cantidad * precio} />
                    </div>

                    <div className="card-actions justify-end">
                        <button
                            className="btn btn-error"
                            onClick={(ev) => {
                                ev.preventDefault();
                                setIsDeleting(true);
                            }}
                        >
                            Borrar
                        </button>

                        <div className="flex-grow"></div>

                        <button type="submit" className="btn btn-primary">
                            Editar
                        </button>
                        <button className="btn btn-ghost" onClick={handleCancelar}>
                            Cancelar
                        </button>
                    </div>
                </form>

                {isDeleting ? (
                    <form id="form-delete" className="mt-6" action={borrarFormAction} method="post">
                        <div className="card-title">¿Está seguro que desea borrar este item?</div>

                        <div className="card-actions justify-end">
                            <button type="submit" className="btn btn-error">
                                Sí
                            </button>

                            <button className="btn btn-ghost" onClick={() => setIsDeleting(false)}>
                                No
                            </button>
                        </div>
                    </form>
                ) : undefined}
            </div>
        </div>
    );
}
