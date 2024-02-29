"use server";

import { z } from "@/validation";


const schema = z.object({
    nombre: z.string().max(64),
    descripcion: z.string().max(64),
});

export async function crearCategoria(prevState: any, formData: FormData) {
    const validatedFields = schema.safeParse({
        nombre: formData.get('nombre'),
        descripcion: formData.get('descripcion'),
    })

    // Return early if the form data is invalid
    if (!validatedFields.success) {
        console.error(validatedFields.error.message, validatedFields.error.flatten().fieldErrors)

        return {
            message: "Error al crear la categoría: " + validatedFields.error.message,
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }


    return {
        message: "WE HAVE A SITUATION",
        errors: null
    };
}
