import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<string> {
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
        <label className="form-control w-full max-w-xs">
            <div className="label">{label ? <span className="label-text">{label}</span> : null}</div>

            <input {...rest} className="input input-bordered w-full max-w-xs" />

            <div className="label">{error ? <span className="label-text-alt text-red-400">{error}</span> : null}</div>
        </label>
    );
}
