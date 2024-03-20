"use client";

import { FormError } from "@/components/forms/FormError";
import { newInitialState, useStateToastNotifications } from "@/components/forms/useStateToastNotifications";
import { AjusteInventario, Transferencia } from "@/lib/queries/shared";
import { useFormState } from "react-dom";
import { ToastContainer } from "react-toastify";
import { bindBorrarTransferencia } from "./page";

const initialState = newInitialState();

interface Props {
    ajuste: AjusteInventario;
    onSubmit: ReturnType<typeof bindBorrarTransferencia>;
}

export default function Form({ ajuste: ajuste, onSubmit }: Props) {
    const [state, formAction] = useFormState(onSubmit, initialState);

    useStateToastNotifications(state);

    return (
        <form action={formAction} method="post">
            <ToastContainer />

            <div className="card-body">
                <div className="card-title">
                    ¿Está seguro que desea borrar el ajuste <em>#{ajuste.id}</em>?
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
