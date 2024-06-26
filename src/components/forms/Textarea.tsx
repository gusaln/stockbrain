import { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<string> {
    label?: string;
    errors?: string | string[] | null;
}

function getError(errors: string | string[] | null) {
    if (Array.isArray(errors)) {
        return errors[0];
    }

    return errors;
}

export default function Textarea(props: TextareaProps) {
    const { label, errors, ...rest } = props;

    const error = getError(errors);

    return (
        <label className="form-control w-full">
            <div className="label">{label ? <span className="label-text">{label}</span> : null}</div>

            <textarea {...rest} className="input input-bordered w-full" />

            <div className="label">{error ? <span className="label-text-alt text-red-400">{error}</span> : null}</div>
        </label>
    );
}
