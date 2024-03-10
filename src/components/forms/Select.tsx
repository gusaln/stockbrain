import { Listbox } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { ReactNode, SelectHTMLAttributes } from "react";
import { OptionHTMLAttributes } from "react";

interface SelectProps<T> extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    selected: T;
    onSelectChanged: (value: number) => void;
    options: T[];
    nameElement: (option: T) => ReactNode;
    optionElement: (option: T, selected: boolean, active: boolean, index: number) => ReactNode;
    errors?: string | string[] | null;
}

function getError(errors: string | string[] | null) {
    if (Array.isArray(errors)) {
        return errors[0];
    }

    return errors;
}

export default function Select<T extends { id: number } = unknown>(props: SelectProps<T>) {
    const { label, options, errors = null, ...rest } = props;

    const error = getError(errors);

    return (
        <>
            <Listbox name={props.name} value={props?.selected.id} onChange={props?.onSelectChanged}>
                <Listbox.Label className="form-control w-full max-w-xs relative">
                    <div className="label">{label ? <span className="label-text">{label}</span> : null}</div>

                    <Listbox.Button className="input input-bordered">
                        <div className="flex justify-between items-center">
                            {props.nameElement(props?.selected)}
                            <ChevronDownIcon height={16} />
                        </div>
                    </Listbox.Button>

                    <Listbox.Options className="menu dropdown-content absolute top-[105%] left-[35%] min-w-64  z-1 bg-white border-gray-400 border">
                        {options.map((option, index) => (
                            <Listbox.Option key={option.id} value={option.id}>
                                {(opcionProps) => {
                                    return (
                                        <option
                                            className={opcionProps.selected ? "bg-blue-300" : undefined}
                                            value={option.id}
                                        >
                                            {props.optionElement(
                                                option,
                                                opcionProps.selected,
                                                opcionProps.active,
                                                index,
                                            )}
                                        </option>
                                    );
                                }}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Listbox.Label>
            </Listbox>
        </>
    );
}
