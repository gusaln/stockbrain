"use server";

import { z } from "@/validation";


const schema = z.object({
    nombre: z.string().trim().max(64),
    ubicacion: z.string().trim().max(64),
});

export async function crearAlmacen(prevState: any, formData: FormData) {
    const validatedFields = schema.safeParse({
        nombre: formData.get('nombre'),
        ubicacion: formData.get('ubicacion'),
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
