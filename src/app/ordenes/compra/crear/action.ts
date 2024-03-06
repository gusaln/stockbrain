"use server";

import { z } from "@/validation";


const schema = z.object({
    proveedorId: z.number().int().positive(),
    fecha: z.string().trim().max(64),
    operadorId: z.number().int().positive(),
});

export async function crearOrdenCompra(prevState: any, formData: FormData) {
    const validatedFields = schema.safeParse({
        proveedorId: formData.get('proveedor'),
        fecha: formData.get('fecha'),
        operadorId: formData.get('operador'),
    })

    // Return early if the form data is invalid
    if (!validatedFields.success) {
        console.error(validatedFields.error.message, validatedFields.error.flatten().fieldErrors)

        return {
            message: "Error al crear la orden de compra: " + validatedFields.error.message,
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }


    return {
        message: "WE HAVE A SITUATION",
        errors: null
    };
}