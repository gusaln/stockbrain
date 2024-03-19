"use server";

import { authenticateOrFail } from "@/lib/auth";
import { createAjusteInventario } from "@/lib/queries";
import { AjusteInventarioTipo, ProductoEstado } from "@/lib/queries/shared";
import { parseDateFromInput } from "@/lib/queries/utils";
import { z } from "@/validation";
import { redirect } from "next/navigation";

const schema = z.object({
    fecha: z.string().trim().max(64).datetime({ offset: true }),
    almacenId: z.number().int().positive(),
    productoId: z.number().int().positive(),
    estado: z.number().int().positive(),
    tipo: z.number(),
    cantidad: z.number(),
    motivo: z.string().trim().max(256),
});

export async function crearAjuste(prevState: any, formData: FormData) {
    const validatedFields = schema.safeParse({
        fecha: formData.get("fecha") + "T00:00:00-04",
        almacenId: parseInt(formData.get("almacenId") as string),
        productoId: parseInt(formData.get("productoId") as string),
        estado: parseInt(formData.get("estado") as string),
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
        parseDateFromInput(formData.get("fecha") as string),
        validatedFields.data.almacenId,
        validatedFields.data.productoId,
        validatedFields.data.estado as ProductoEstado,
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
