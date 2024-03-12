"use server";

import { updateAjusteInventario } from "@/lib/queries";
import { z } from "@/validation";
import { redirect } from "next/navigation";


const schema = z.object({
    fecha: z.string().trim().max(64),
    almacenId: z.number(),
    productoId: z.number(),
    tipo: z.number(),
    cantidad: z.number(),
    motivo: z.string().trim().max(300),
});

export async function editarAjuste(ajusteId: number, prevState: any, formData: FormData) {
    const validatedFields = schema.safeParse({
        fecha: formData.get('fecha'),
        almacenId: formData.get('almacenId'),
        productoId: formData.get('productoId'),
        tipo: formData.get('tipo'),
        cantidad: formData.get('cantidad'),
        motivo: formData.get('motivo'),
    })

    // Return early if the form data is invalid
    if (!validatedFields.success) {
        console.error(validatedFields.error.message, validatedFields.error.flatten().fieldErrors)

        return {
            message: "Error: " + validatedFields.error.message,
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    await updateAjusteInventario(
        ajusteId,
        validatedFields.data,
    )

    redirect("/ajustes?" + new URLSearchParams({ "message[success]": "Ajuste editado con éxito" }));

    return {
        message: "Success",
        errors: null,
    }
}
