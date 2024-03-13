import { format, parseISO } from "date-fns";

export function formatDatetime(date: string) {
    return format(parseISO(date), "dd/MM/yyyy");
}
