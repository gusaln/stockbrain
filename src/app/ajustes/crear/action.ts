"use server";

import { z } from "@/validation";


const schema = z.object({
    fecha: z.string().max(64),
    almacen: z.number().max(64),
    producto: z.number().max(64),
    tipo: z.number().max(1),
    cantidad: z.number(),
    motivo: z.string().max(300),
});

export async function crearAjuste(prevState: any, formData: FormData) {
    const validatedFields = schema.safeParse({
        fecha: formData.get('fecha'),
        almacen: formData.get('almacen'),
        producto: formData.get('producto'),
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
