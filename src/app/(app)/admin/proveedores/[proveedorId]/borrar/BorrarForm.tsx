"use client";

import Input from "@/components/forms/Input";
import Textarea from "@/components/forms/Textarea";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { ToastContainer, toast } from "react-toastify";
import { bindProveedorId } from "./page";
import { FormError } from "@/components/forms/FormError";
import { Proveedor } from "@/lib/queries/shared";

const initialState = {
    message: "",
    errors: null,
};

interface Props {
    proveedor: Proveedor;
    onSubmit: ReturnType<typeof bindProveedorId>;
}

export default function Form({ proveedor, onSubmit }: Props) {
    const [state, formAction] = useFormState(onSubmit, initialState);

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
                    ¿Está seguro que desea borrar al proveedor <em>{proveedor.nombre}</em>?
                </div>

                <FormError message={state.message}/>


                <div className="card-actions justify-end">
                    <button type="submit" className="btn btn-error">
                        Editar
                    </button>
                    {/* <button className="btn btn-ghost">Cancelar</button> */}
                </div>
            </div>
        </form>
    );
}
