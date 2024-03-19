import { format, parse } from "date-fns";

export function parseDateFromInput(date: string) {
    return parse(date, "yyyy-MM-dd", new Date());
}

export function formatForSql(date: Date) {
    return format(date, "yyyy-MM-dd 00:00:00");
}
