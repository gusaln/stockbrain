"use server";

import { authenticateOrFail } from "@/lib/auth";
import { createAjusteInventario } from "@/lib/queries";
import { AjusteInventarioTipo } from "@/lib/queries/shared";
import { z } from "@/validation";
import { parse } from "date-fns";
import { redirect } from "next/navigation";

const schema = z.object({
    fecha: z.string().trim().max(64).datetime(),
    almacenId: z.number().int().positive(),
    productoId: z.number().int().positive(),
    tipo: z.number(),
    cantidad: z.number(),
    motivo: z.string().trim().max(256),
});

export async function crearAjuste(prevState: any, formData: FormData) {
    const validatedFields = schema.safeParse({
        fecha: formData.get("fecha") + "T00:00:00Z",
        almacenId: parseInt(formData.get("almacenId") as string),
        productoId: parseInt(formData.get("productoId") as string),
        tipo: parseInt(formData.get("tipo") as string),
        cantidad: parseInt(formData.get("cantidad") as string),
        motivo: formData.get("motivo"),
    });

    if (!validatedFields.success) {
        return {
            message: "Datos inválidos",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const user = await authenticateOrFail();

    const ajusteId = await createAjusteInventario(
        user.id,
        parse(formData.get("fecha") as string, "yyyy-MM-dd", new Date()),
        validatedFields.data.almacenId,
        validatedFields.data.productoId,
        validatedFields.data.tipo as AjusteInventarioTipo,
        validatedFields.data.cantidad,
        validatedFields.data.motivo,
    );

    redirect(
        "/ajustes?" +
            new URLSearchParams({
                "message[success]": "Ajuste registrado con éxito",
            }),
    );
}
