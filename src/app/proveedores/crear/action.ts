"use server";

import { z } from "@/validation";


const schema = z.object({
    nombre: z.string().max(64),
    contacto: z.string().max(64),
    telefono: z.string().max(32),
    email: z.string().max(128).email(),
    direccion: z.string().max(128),
});

export async function crearProveedor(prevState: any, formData: FormData) {
    const validatedFields = schema.safeParse({
        nombre: formData.get('nombre'),
        contacto: formData.get('contacto'),
        telefono: formData.get('telefono'),
        email: formData.get('email'),
        direccion: formData.get('direccion'),
    })

    // Return early if the form data is invalid
    if (!validatedFields.success) {
        console.error(validatedFields.error.message, validatedFields.error.flatten().fieldErrors)

        return {
            message: "Error al crear el proveedor: " + validatedFields.error.message,
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }


    return {
        message: "WE HAVE A SITUATION",
        errors: null
    };
}
