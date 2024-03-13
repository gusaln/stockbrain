"use client";

import Input from "@/components/forms/Input";
import { useState } from "react";
import { useFormState } from "react-dom";
import { crearUsuario } from "./action";
import { FormError } from "@/components/forms/FormError";

const initialState = {
    message: "",
};

interface Props {
    onSubmit: typeof crearUsuario;
}

export function CrearUsuarioForm(props: Props) {
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const [state, formAction] = useFormState(props.onSubmit, initialState);

    return (
        <form action={formAction} method="post">
            <div className="card-body">
                <div className="card-title">Indique los datos del nuevo usuario</div>

                <FormError message={state.message}/>

                <Input name="nombre" label="Nombre" />
                <Input name="email" label="Email" type="email" />
                <Input
                    name="password"
                    label="Contraseña"
                    type="password"
                    value={password}
                    onChange={(ev) => setPassword(ev.target.value)}
                />
                <Input
                    name="password_confirmation"
                    label="Confirmar contraseña"
                    type="password"
                    value={passwordConfirmation}
                    onChange={(ev) => setPasswordConfirmation(ev.target.value)}
                    errors={
                        passwordConfirmation.length > 1 && password != passwordConfirmation
                            ? "no coincide con la contraseña"
                            : null
                    }
                />

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
