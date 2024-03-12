import { format } from "date-fns";

export function formatForSql(date: Date) {
    return format(date, "yyyy-MM-dd 00:00:00");
}
