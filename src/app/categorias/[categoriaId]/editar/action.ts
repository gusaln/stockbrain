"use server";

import { updateCategoria } from "@/lib/queries";
import { z } from "@/validation";
import { redirect } from "next/navigation";


const schema = z.object({
    nombre: z.string().trim().max(64),
    descripcion: z.string().trim().max(128),
});

export async function editarCategoria(categoriaId: number, prevState: any, formData: FormData) {
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

    await updateCategoria(
        categoriaId,
        validatedFields.data,
    )

    redirect("/categorias?"+new URLSearchParams({"message[success]": "Categoría editada con éxito"}));

    return {
        message: "Success",
        errors: null,
    }
}
