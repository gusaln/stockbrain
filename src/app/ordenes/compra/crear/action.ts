"use server";

import { z } from "@/validation";


const schema = z.object({
    proveedorId: z.string().max(64),
    fecha: z.string().max(64),
    operadorId: z.string().max(32),
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