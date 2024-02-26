import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<string> {
    label?: string;
    error?: string | null;
}

export default function Input(props: InputProps) {
    const { label, error, ...rest } = props;

    return (
        <label className="form-control w-full max-w-xs">
            <div className="label">{label ? <span className="label-text">{label}</span> : null}</div>

            <input {...rest} className="input input-bordered w-full max-w-xs" />

            <div className="label">{error ? <span className="label-text-alt text-red-400">{error}</span> : null}</div>
        </label>
    );
}
