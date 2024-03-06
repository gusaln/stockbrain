"use server";

import { createCategoria } from "@/lib/queries";
import { z } from "@/validation";
import { redirect } from "next/navigation";


const schema = z.object({
    nombre: z.string().trim().max(64),
    descripcion: z.string().trim().max(128),
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
            message: "Error: " + validatedFields.error.message,
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const productoId = await createCategoria(
        validatedFields.data.nombre,
        validatedFields.data.descripcion,
    )

    redirect("/categorias?"+new URLSearchParams({"message[success]": "Categoría registrada con éxito"}));

    return {
        message: "Success",
        errors: null,
    }
}
