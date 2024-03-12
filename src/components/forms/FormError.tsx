import { ExclamationTriangleIcon } from "@heroicons/react/16/solid";

export function FormError({ message }: { message?: string | null }) {
    if (!message || message == "") {
        return;
    }

    return (
        <div role="alert" className="alert alert-error mb-12">
            <ExclamationTriangleIcon width="16" />
            <span>{message}</span>
        </div>
    );
}
