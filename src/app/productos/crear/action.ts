"use server";
import { z } from "@/validation";

const schema = z.object({
    categoriaId: z.string().max(64),
    marca: z.string().max(64),
    modelo: z.string().max(64),
    descripcion: z.string().max(64),
    imagen: z.string().max(64),
});

export async function crearProducto( prevState: any, formData: FormData) {
    const validatedFields = schema.safeParse({
        categoriaId: formData.get('categoriaId'),
        marca: formData.get('marca'),
        modelo: formData.get('modelo'),
        descripcion: formData.get('descripcion'),
        imagen: formData.get('imagen'),
    })

    if (!validatedFields.success){
        console.error(validatedFields.error.message, validatedFields.error.flatten().fieldErrors)

        return {
            message: "Error al crear la orden de consumo: " + validatedFields.error.message,
            errors: validatedFields.error.flatten().fieldErrors
        }
    }

    return {
        message: "WE HAVE A SITUATION",
        errors: null
    }
}