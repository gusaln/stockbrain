"use server";

import { updateProducto } from "@/lib/queries";
import { z } from "@/validation";
import { redirect } from "next/navigation";


const schema = z.object({
    categoriaId: z.string().max(64).trim(),
    marca: z.string().max(64).trim(),
    modelo: z.string().max(64).trim(),
    descripcion: z.string().max(64).trim(),
    imagen: z.string().max(64).nullable(),
});

export async function editarProducto(productoId: number, prevState: any, formData: FormData) {
    const validatedFields = schema.safeParse({
        categoriaId: formData.get('categoriaId'),
        marca: formData.get('marca'),
        modelo: formData.get('modelo'),
        descripcion: formData.get('descripcion'),
        imagen: formData.get('imagen'),
    })

    // Return early if the form data is invalid
    if (!validatedFields.success) {
        console.error(validatedFields.error.message, validatedFields.error.flatten().fieldErrors)

        return {
            message: "Error: " + validatedFields.error.message,
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    await updateProducto(
        productoId,
        validatedFields.data,
    )

    redirect("/productos?"+new URLSearchParams({"message[success]": "Producto editado con éxito"}));

    return {
        message: "Success",
        errors: null,
    }
}
