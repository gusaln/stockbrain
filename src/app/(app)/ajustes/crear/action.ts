"use server";

import { z } from "@/validation";


const schema = z.object({
    fecha: z.string().trim().max(64),
    almacenId: z.number(),
    productoId: z.number(),
    tipo: z.number(),
    cantidad: z.number(),
    motivo: z.string().trim().max(300),
});

export async function crearAjuste(prevState: any, formData: FormData) {
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


    return {
        message: "WE HAVE A SITUATION",
        errors: null
    };
}
