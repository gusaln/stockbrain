import { format, isDate, isValid, parse, parseISO } from "date-fns";

export function parseDateFromInput(date: string) {
    return parse(date, "yyyy-MM-dd", new Date());
}

export function formatForInput(date: Date | string) {
    if (typeof date == "string") {
        try {
            date = parseDateFromInput(date);
        } catch (error) {}
    }

    if (typeof date == "string") {
        try {
            date = parseISO(date);
        } catch (error) {}
    }

    return format(date, "yyyy-MM-dd");
}

export function formatForSql(date: Date | string) {
    // console.log("formatting", { date });

    if (typeof date == "string") {
        const original = date;
        try {
            date = parseDateFromInput(date);
        } catch (error) {}
        if (!isValid(date)) {
            date = original;
        }
        // console.log("formatting from input", { date });
    }

    if (typeof date == "string") {
        const original = date;
        try {
            date = parseISO(date);
        } catch (error) {}
        if (!isValid(date)) {
            date = original;
        }
        // console.log("formatting from iso", { date });
    }

    if (!isDate(date)) {
        throw new Error("No se pudo interpretar '" + date + "' como date");
    }

    return format(date, "yyyy-MM-dd 00:00:00");
}

export function formatMoney(amount: number) {
    return (
        amount.toLocaleString("en-VE", { currency: "VEF", minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " $"
    );
}
