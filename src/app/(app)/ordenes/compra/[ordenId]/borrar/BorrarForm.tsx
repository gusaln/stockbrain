"use client";

import Input from "@/components/forms/Input";
import Textarea from "@/components/forms/Textarea";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { ToastContainer, toast } from "react-toastify";
import { bindOrdenId } from "./page";
import { FormError } from "@/components/forms/FormError";
import { Orden, OrdenCompra } from "@/lib/queries/shared";
import { error } from "console";
import { newInitialState, useStateToastNotifications } from "@/components/forms/useStateToastNotifications";

const initialState = newInitialState();

interface Props {
    orden: OrdenCompra;
    onSubmit: ReturnType<typeof bindOrdenId>;
}

export default function Form({ orden, onSubmit }: Props) {
    const [state, formAction] = useFormState(onSubmit, initialState);

    useStateToastNotifications(state);

    return (
        <form action={formAction} method="post">
            <ToastContainer />

            <div className="card-body">
                <div className="card-title">
                    ¿Está seguro que desea borrar la orden #<em>{orden.id}</em>?
                </div>

                <FormError message={state?.messages?.error} />

                <div className="card-actions justify-end">
                    <button type="submit" className="btn btn-error">
                        Borrar
                    </button>
                    {/* <button className="btn btn-ghost">Cancelar</button> */}
                </div>
            </div>
        </form>
    );
}
