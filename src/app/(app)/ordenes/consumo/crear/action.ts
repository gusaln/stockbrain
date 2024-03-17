"use server";

import { authenticateOrFail } from "@/lib/auth";
import { NewOrdenConsumoItem, createOrdenConsumo } from "@/lib/queries";
import { z } from "@/validation";
import { parse } from "date-fns";
import { redirect } from "next/navigation";

const schema = z.object({
    descripcion: z.string().trim().max(64),
    fecha: z.string().trim().max(64).datetime(),
    items: z
        .array(
            z.object({
                almacenId: z.number().int().positive(),
                productoId: z.number().int().positive(),
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
            almacenId: parseInt((formData.get(`items[${index}].almacenId`) as string) ?? ""),
            productoId: parseInt((formData.get(`items[${index}].productoId`) as string) ?? ""),
            cantidad: parseInt((formData.get(`items[${index}].cantidad`) as string) ?? "0"),
        });
    }

    // console.log("formData", formData, "itemCount", itemCount, "items", items)

    const validatedFields = schema.safeParse({
        fecha: formData.get("fecha") + "T00:00:00Z",
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
        "/ordenes/compra?" +
            new URLSearchParams({
                "message[success]": "Orden de compra registrada con éxito",
            }),
    );
}
