import { SelectHTMLAttributes } from "react";
import { OptionHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: OptionHTMLAttributes<HTMLOptionElement>[];
    errors?: string | string[] | null;
}

function getError(errors: string | string[] | null) {
    if (Array.isArray(errors)) {
        return errors[0];
    }

    return errors;
}


const Select: React.FC<SelectProps> = ({ options, ...rest }) => {
    return (
        <select {...rest}>
            {options.map((option, index) => (
                <option key={index} {...option}>
                    {option.children}
                </option>
            ))}
        </select>
    );
};

export default function Select(props: SelectProps) {
    const { label, options, errors, ...rest } = props;

    const error = getError(errors);

    return (
        <label className="form-control w-full max-w-xs">
            <div className="label">{label ? <span className="label-text">{label}</span> : null}</div>

            <select {...rest}>
                {options.map((option, index) => (
                    <option key={index} {...option}>
                        {option.children}
                    </option>
                ))}
            </select>

            <div className="label">{error ? <span className="label-text-alt text-red-400">{error}</span> : null}</div>
        </label>
    );
}