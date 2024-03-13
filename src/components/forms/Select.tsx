import { Listbox } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { ReactNode, SelectHTMLAttributes, useMemo } from "react";
import { OptionHTMLAttributes } from "react";

interface SelectProps<TOption, TValue extends string | number> extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    selected?: TValue;
    placeholder?: string;
    onSelectChanged: (value: TValue) => void;
    options: TOption[];
    text: (option: TOption) => ReactNode;
    option: (option: TOption, selected: boolean, active: boolean, index: number) => ReactNode;
    optionValue: (option: TOption) => TValue;
    errors?: string | string[] | null;
}

function getError(errors: string | string[] | null) {
    if (Array.isArray(errors)) {
        return errors[0];
    }

    return errors;
}

export default function Select<O, V extends string | number>(props: SelectProps<O, V>) {
    const {
        label,
        selected,
        placeholder = null,
        options,
        errors = null,
        option,
        optionValue,
        onChange,
        ...rest
    } = props;

    const error = getError(errors);

    const innerSelected = useMemo(
        () => options.find((o) => optionValue(o) == selected),
        [selected, options, optionValue],
    );

    return (
        <>
            <Listbox name={props.name} value={props?.selected} onChange={props?.onSelectChanged} {...rest}>
                <Listbox.Label className="form-control w-full relative">
                    <div className="label">{label ? <span className="label-text">{label}</span> : null}</div>

                    <Listbox.Button className="input input-bordered">
                        <div className="flex justify-between items-center">
                            {innerSelected ? props.text(innerSelected) : placeholder}
                            <ChevronDownIcon height={16} />
                        </div>
                    </Listbox.Button>

                    <Listbox.Options className="menu dropdown-content absolute top-[105%] left-[35%] min-w-64  z-1 bg-white border-gray-400 border">
                        {options.map((option, index) => (
                            <Listbox.Option key={optionValue(option)} value={optionValue(option)}>
                                {(opcionProps) => {
                                    return (
                                        <option
                                            className={opcionProps.selected ? "bg-blue-300" : undefined}
                                            value={optionValue(option)}
                                        >
                                            {props.option(option, opcionProps.selected, opcionProps.active, index)}
                                        </option>
                                    );
                                }}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>

                    <div className="label">
                        {error ? <span className="label-text-alt text-red-400">{error}</span> : null}
                    </div>
                </Listbox.Label>
            </Listbox>
        </>
    );
}
