import { useEffect } from "react";
import { toast } from "react-toastify";

interface Messages {
    success?: string;
    error?: string;
}

export function newInitialState() {
    return {
        messages: {} as Messages,
        errors: null,
    };
}

export function useStateToastNotifications(state: { messages?: Messages }) {
    useEffect(() => {
        if (state?.messages?.success) {
            toast.success(state?.messages.success);
        }

        if (state?.messages?.error) {
            toast.error(state?.messages.error);
        }
    }, [state]);
}
