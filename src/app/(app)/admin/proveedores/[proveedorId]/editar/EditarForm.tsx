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

    const [nombre, setNombre] = useState(proveedor.nombre);
    const [contacto, setContacto] = useState(proveedor.contacto);
    const [telefono, setTelefono] = useState(proveedor.telefono);
    const [email, setEmail] = useState(proveedor.email);
    const [direccion, setDireccion] = useState(proveedor.direccion);

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
                    Proveedor <em>{proveedor.nombre}</em>
                </div>

                <FormError message={state.message}/>

                <Input
                    name="nombre"
                    label="Nombre"
                    onChange={(ev) => setNombre(ev.target.value)}
                    value={nombre}
                    errors={state.errors?.nombre}
                />
                <Input
                    name="contacto"
                    label="Contacto"
                    onChange={(ev) => setContacto(ev.target.value)}
                    value={contacto}
                    errors={state.errors?.contacto}
                />
                <Input
                    name="telefono"
                    label="Teléfono"
                    onChange={(ev) => setTelefono(ev.target.value)}
                    value={telefono}
                    errors={state.errors?.telefono}
                />
                <Input
                    name="email"
                    label="Email"
                    onChange={(ev) => setEmail(ev.target.value)}
                    value={email}
                    errors={state.errors?.email}
                />
                <Textarea
                    name="direccion"
                    label="Dirección"
                    onChange={(ev) => setDireccion(ev.target.value)}
                    value={direccion}
                    errors={state.errors?.direccion}
                />

                <div className="card-actions justify-end">
                    <button type="submit" className="btn btn-primary">
                        Editar
                    </button>
                    <button className="btn btn-ghost">Cancelar</button>
                </div>
            </div>
        </form>
    );
}
