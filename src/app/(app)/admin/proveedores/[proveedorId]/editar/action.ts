"use server";

import { updateProveedor } from "@/lib/queries";
import { z } from "@/validation";
import { redirect } from "next/navigation";

const schema = z.object({
    nombre: z.string().trim().min(1).max(64),
    contacto: z.string().trim().min(1).max(64),
    telefono: z.string().trim().min(11).max(32),
    email: z.string().trim().email().max(128),
    direccion: z.string().trim().min(5).max(128),
});

export async function editarProveedor(proveedorId: number, prevState: any, formData: FormData) {
    const validatedFields = schema.safeParse({
        nombre: formData.get("nombre"),
        contacto: formData.get("contacto"),
        telefono: formData.get("telefono"),
        email: formData.get("email"),
        direccion: formData.get("direccion"),
    });

    // Return early if the form data is invalid
    if (!validatedFields.success) {
        console.error(validatedFields.error.message, validatedFields.error.flatten().fieldErrors);

        return {
            message: "Datos inválidos",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    await updateProveedor(proveedorId, validatedFields.data);

    redirect("/admin/proveedores?" + new URLSearchParams({ "message[success]": "Proveedor editado con éxito" }));
}
