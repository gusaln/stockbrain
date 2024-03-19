"use client";

import { FormError } from "@/components/forms/FormError";
import Input from "@/components/forms/Input";
import Select from "@/components/forms/Select";
import { Almacen, OrdenCompraItem, Producto } from "@/lib/queries/shared";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { ToastContainer, toast } from "react-toastify";
import { bindBorrarOrdenCompraItem, bindEditarOrdenCompraItem } from "./page";
import { useStateToastNotifications } from "@/components/forms/useStateToastNotifications";

const initialState = {
    message: "",
    errors: null,
};

interface Props {
    onSubmit: ReturnType<typeof bindBorrarOrdenCompraItem>;
}

export default function DeleteItemForm({ onSubmit }: Props) {
    const [state, formAction] = useFormState(onSubmit, initialState);

    const [isConfirming, setIsConfirming] = useState(false);

    useStateToastNotifications(state)


    return (
        <form id="form-data" action={formAction} method="post">
            <ToastContainer />

            <div className="card-body">
                {isConfirming ? (
                    <div>
                        <div className="card-title">¿Está seguro que desea el item?</div>

                        <button type="submit" className="btn btn-error">
                            Borrar
                        </button>

                        <button className="btn btn-ghost" onClick={() => setIsConfirming(false)}>
                            Cancelar
                        </button>
                    </div>
                ) : undefined}

                <FormError message={state?.messages?.error} />

                <div className="card-actions justify-end">
                    <button className="btn btn-error" onClick={() => setIsConfirming(true)}>
                        Borrar
                    </button>
                </div>
            </div>
        </form>
    );
}
