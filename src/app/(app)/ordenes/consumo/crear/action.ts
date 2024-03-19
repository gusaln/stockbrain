"use server";

import { authenticateOrFail } from "@/lib/auth";
import { NewOrdenConsumoItem, createOrdenConsumo } from "@/lib/queries";
import { z } from "@/validation";
import { parse } from "date-fns";
import { redirect } from "next/navigation";

const schema = z.object({
    fecha: z.string().trim().max(64).datetime({ offset: true }),
    descripcion: z.string().trim().max(128),
    items: z
        .array(
            z.object({
                productoId: z.number().int().positive(),
                almacenId: z.number().int().positive(),
                cantidad: z.number().int().positive(),
            }),
        )
        .min(1),
});

export async function crearOrdenConsumo(prevState: any, formData: FormData) {
    const items: NewOrdenConsumoItem[] = [];

    const itemCount = Number.parseInt((formData.get("__itemCount") as string) ?? "0", 10);
    for (let index = 0; index < itemCount; index++) {
        items.push({
            productoId: parseInt((formData.get(`items[${index}].productoId`) as string) ?? ""),
            almacenId: parseInt((formData.get(`items[${index}].almacenId`) as string) ?? ""),
            cantidad: parseInt((formData.get(`items[${index}].cantidad`) as string) ?? "0"),
        });
    }

    const validatedFields = schema.safeParse({
        fecha: formData.get("fecha") + "T00:00:00-04",
        descripcion: formData.get("descripcion"),
        items: items,
    });

    // Return early if the form data is invalid
    if (!validatedFields.success) {
        return {
            message: "Datos inválidos",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const user = await authenticateOrFail();

    const ordenId = await createOrdenConsumo(
        validatedFields.data.descripcion,
        parse(formData.get("fecha") as string, "yyyy-MM-dd", new Date()),
        user.id,
        validatedFields.data.items,
    );

    redirect(
        "/ordenes/consumo?" +
            new URLSearchParams({
                "message[success]": "Orden de consumo registrada con éxito",
            }),
    );
}
