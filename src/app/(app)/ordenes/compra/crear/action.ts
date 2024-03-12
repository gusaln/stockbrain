"use server";

import { authenticateOrFail } from "@/lib/auth";
import { NewOrdenCompraItem, createOrdenCompra } from "@/lib/queries";
import { z } from "@/validation";
import { parse } from "date-fns";
import { redirect } from "next/navigation";

const schema = z.object({
    proveedorId: z.number().int().positive(),
    fecha: z.string().trim().max(64).datetime(),
    items: z
        .array(
            z.object({
                productoId: z.number().int().positive(),
                precioUnitario: z.number().positive(),
                cantidad: z.number().int().positive(),
            }),
        )
        .min(1),
});

export async function crearOrdenCompra(prevState: any, formData: FormData) {
    const items: NewOrdenCompraItem[] = [];

    const itemCount = Number.parseInt((formData.get("__itemCount") as string) ?? "0", 10);
    for (let index = 0; index < itemCount; index++) {
        items.push({
            productoId: parseInt((formData.get(`items[${index}].productoId`) as string) ?? ""),
            precioUnitario: parseFloat((formData.get(`items[${index}].precioUnitario`) as string) ?? "0"),
            cantidad: parseInt((formData.get(`items[${index}].cantidad`) as string) ?? "0"),
        });
    }

    // console.log("formData", formData, "itemCount", itemCount, "items", items)

    const validatedFields = schema.safeParse({
        proveedorId: parseInt(formData.get("proveedorId") as string),
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

    const ordenId = await createOrdenCompra(
        validatedFields.data.proveedorId,
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
