"use client";

import { FormError } from "@/components/forms/FormError";
import { newInitialState, useStateToastNotifications } from "@/components/forms/useStateToastNotifications";
import { OrdenConsumo } from "@/lib/queries/shared";
import { useFormState } from "react-dom";
import { ToastContainer } from "react-toastify";
import { bindOrdenConsumoId } from "./page";

const initialState = newInitialState();

interface Props {
    orden: OrdenConsumo;
    onSubmit: ReturnType<typeof bindOrdenConsumoId>;
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
