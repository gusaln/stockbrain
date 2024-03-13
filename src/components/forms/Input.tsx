import { ChangeEvent, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    errors?: string | string[] | null;
}

function getError(errors: string | string[] | null) {
    if (Array.isArray(errors)) {
        return errors[0];
    }

    return errors;
}

export default function Input(props: InputProps) {
    const { label, errors, ...rest } = props;

    const error = getError(errors);

    return (
        <label className={"form-control w-full " + (error ? "text-error" : "")}>
            <div className="label">{label ? <span className="label-text text-inherit">{label}</span> : null}</div>

            <input {...rest} className="input input-bordered w-full" />

            <div className="label">{error ? <span className="label-text-alt text-red-400">{error}</span> : null}</div>
        </label>
    );
}
