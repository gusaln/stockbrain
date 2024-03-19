"use server";

import { authenticateOrFail } from "@/lib/auth";
import { updateAjusteInventario } from "@/lib/queries";
import { z } from "@/validation";
import { redirect } from "next/navigation";

const schema = z.object({
    fecha: z.string().trim().max(64),
    almacenId: z.number(),
    productoId: z.number(),
    estado: z.number().int().positive(),
    tipo: z.number(),
    cantidad: z.number(),
    motivo: z.string().trim().max(300),
});

export async function editarAjuste(ajusteId: number, prevState: any, formData: FormData) {
    const validatedFields = schema.safeParse({
        fecha: formData.get("fecha") + "T00:00:00Z",
        almacenId: parseInt(formData.get("almacenId") as string),
        productoId: parseInt(formData.get("productoId") as string),
        estado: parseInt(formData.get("estado") as string),
        tipo: parseInt(formData.get("tipo") as string),
        cantidad: parseInt(formData.get("cantidad") as string),
        motivo: formData.get("motivo"),
    });

    // Return early if the form data is invalid
    if (!validatedFields.success) {
        console.error(validatedFields.error.message, validatedFields.error.flatten().fieldErrors);

        return {
            message: "Datos inválidos",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    await updateAjusteInventario(ajusteId, validatedFields.data, (await authenticateOrFail()).id);

    redirect("/ajustes?" + new URLSearchParams({ "message[success]": "Ajuste editado con éxito" }));
}
