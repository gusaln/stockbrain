"use server";

import { isProveedorUsed } from "@/lib/queries";
import { redirect } from "next/navigation";

export async function borrarProveedor(proveedorId: number, prevState: any, formData: FormData) {
    // Return early if the form data is invalid
    if (await isProveedorUsed(proveedorId)) {
        return {
            message: "El proveedor está registrado entre las ordenes de compra y no puede eliminarse",
            errors: null,
        };
    }

    // await updateProveedor(proveedorId, validatedFields.data);

    redirect("/admin/proveedores?" + new URLSearchParams({ "message[success]": "Proveedor borrado con éxito" }));
}
