import { format, parseISO } from "date-fns";

export function formatDatetime(date: Date | string) {
    if (typeof date == "string") {
        date = parseISO(date);
    }
    return format(date, "dd/MM/yyyy");
}
