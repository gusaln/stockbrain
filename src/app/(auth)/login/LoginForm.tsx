"use client";
import Input from "@/components/forms/Input";
import { useFormState } from "react-dom";
import { login } from "../actions";
import { useEffect } from "react";
import { BellAlertIcon } from "@heroicons/react/16/solid";
import { authenticate } from "@/lib/auth";

const initialState = {
    message: "",
    errors: null,
};

interface Props {
    onSubmit: typeof login;
}

export function LoginForm(props: Props) {
    const [state, formAction] = useFormState(props.onSubmit, initialState);
    // useEffect(() => console.log(state), [state])

    return (
        <form action={formAction} method="post">
            <div className="card-body w-full">
                <div className="card-title">Indique sus credenciales</div>

                <p aria-live="polite" className="sr-only">
                    {state?.message}
                </p>
                {state?.message != "" ? (
                    <div role="alert" className="alert alert-error mb-12">
                        <BellAlertIcon width="16" />
                        <span>{state?.message}</span>
                    </div>
                ) : undefined}
                <Input type="email" name="email" label="Email" errors={state.errors?.email} />
                <Input type="password" name="password" label="Password" errors={state.errors?.email} />

                <div className="card-actions justify-end">
                    <button type="submit" className="btn btn-primary">
                        Login
                    </button>
                </div>
            </div>
        </form>
    );
}
