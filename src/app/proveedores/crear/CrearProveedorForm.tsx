"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { crearProveedor } from "./action";
import Input from "@/components/forms/Input";

const initialState = {
    message: "",
};

interface Props {
    onSubmit: typeof crearProveedor;
}

export default function Form(props: Props) {
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const [state, formAction] = useFormState(props.onSubmit, initialState);

    return (
        <form action={formAction} method="post">
            <div className="card-body">
                <div className="card-title">Indique los datos del nuevo proveedor</div>

                <p aria-live="polite" className="sr-only">
                    {state?.message}
                </p>

                <Input name="nombre" label="Nombre" />
                <Input name="contacto" label="Persona de contacto"  />
                <Input name="telefono" label="Teléfono" type="tel" />
                <Input name="email" label="Email" type="email" />
                <Input name="direccion" label="Dirección" type="text" />

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
