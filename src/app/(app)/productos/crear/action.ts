"use server";
import { createProducto, existsCategoria } from "@/lib/queries";
import { z } from "@/validation";
import { redirect } from "next/navigation";

const schema = z.object({
    categoriaId: z.number().int(),
    marca: z.string().trim().max(64),
    modelo: z.string().trim().max(64),
    descripcion: z.string().trim().max(128),
    imagen: z.string().trim().max(64).nullable(),
}).refine(async (data) => await existsCategoria(data.categoriaId), {
    message: "Categoría no registrada",
    path: ["categoriaId"]
});

export async function crearProducto(prevState: any, formData: FormData) {
    const validatedFields = await schema.safeParseAsync({
        categoriaId: Number(formData.get('categoriaId')),
        marca: formData.get('marca'),
        modelo: formData.get('modelo'),
        descripcion: formData.get('descripcion'),
        imagen: formData.get('imagen'),
    })

    if (!validatedFields.success){
        console.error(validatedFields.error.message, validatedFields.error.flatten().fieldErrors)

        return {
            message: "Error: " + validatedFields.error.message,
            errors: validatedFields.error.flatten().fieldErrors
        }
    }

    const productoId = await createProducto(
        validatedFields.data.categoriaId,
        validatedFields.data.marca,
        validatedFields.data.modelo,
        validatedFields.data.descripcion,
        validatedFields.data.imagen,
    )

    redirect("/productos?"+new URLSearchParams({
        "message[success]": "Producto registrado con éxito"
    }));

    return {
        message: "Success",
        errors: null,
    }
}