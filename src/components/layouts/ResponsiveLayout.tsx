import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonActionProps {
    href: string;
    children?: ReactNode;
}

export function LinkAction(props: ButtonActionProps) {
    return (
        <Link role="button" className="btn" href={props.href}>
            {props.children}
        </Link>
    );
}

interface LinkActionProps {
    onClick: ButtonHTMLAttributes<unknown>["onClick"];
    children?: ReactNode;
}

export function ButtonAction(props: LinkActionProps) {
    return (
        <button role="button" className="btn" onClick={props?.onClick}>
            {props.children}
        </button>
    );
}

interface Props {
    title: ReactNode;
    acciones: () => ReactNode;
    children?: ReactNode;
}

export default function ResponsiveLayout(props: Props) {
    return (
        <div className="w-11/12 sm:w-4/5 lg:3/5 mx-auto">
            <h1 className="font-semibold decoration-wavy decoration-primary">
                {props.title}
            </h1>

            <section className="flex justify-end space-x-2 mb-4">{props.acciones()}</section>

            {props.children}
        </div>
    );
}
