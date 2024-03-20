import { ProductoEstado, PRODUCTO_ESTADO } from "@/lib/queries/shared";
import { InputHTMLAttributes } from "react";

interface ProductoEstadoCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    onSelected?: (v: ProductoEstado) => void;
    errors?: string | string[] | null;
}

function getError(errors: string | string[] | null) {
    if (Array.isArray(errors)) {
        return errors[0];
    }

    return errors;
}

const estados = [
    { value: PRODUCTO_ESTADO.BUENO, text: "Bueno" },
    { value: PRODUCTO_ESTADO.REVISION, text: "En revisión" },
    { value: PRODUCTO_ESTADO.DEFECTUOSO, text: "Defectuoso" },
] as const;

export function ProductoEstadoCheckbox(props: ProductoEstadoCheckboxProps) {
    const { label, onSelected, errors, ...rest } = props;

    const error = getError(errors);

    return (
        <>
            <div className="flex gap-6">
                {estados.map((e) => (
                    <div key={e.value} className="form-control flex-grow">
                        <label className="label cursor-pointer">
                            <span className="label-text">{e.text}</span>
                            <input
                                type="radio"
                                {...rest}
                                className="radio checked:bg-primary"
                                checked={props.value == null ? undefined : props.value == e.value}
                                value={e.value}
                                onSelect={() => onSelected?.(e.value)}
                            />
                        </label>
                    </div>
                ))}
            </div>
            <div className="form-control">
                <div className="label">
                    {error ? <span className="label-text-alt text-red-400">{error}</span> : error}
                </div>
            </div>
        </>
    );
}
