"use server";

import { z } from "@/validation";


const schema = z.object({
    descripcion: z.string().trim().max(64),
    fecha: z.string().trim().max(64),
    operadorId: z.number().positive().int(),
});

export async function crearOrdenConsumo(prevState: any, formData: FormData) {
    const validatedFields = schema.safeParse({
        descripcion: formData.get('descripcion'),
        fecha: formData.get('fecha'),
        operadorId: formData.get('operador'),
    })

    // Return early if the form data is invalid
    if (!validatedFields.success) {
        console.error(validatedFields.error.message, validatedFields.error.flatten().fieldErrors)

        return {
            message: "Error al crear la orden de consumo: " + validatedFields.error.message,
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }


    return {
        message: "WE HAVE A SITUATION",
        errors: null
    };
}