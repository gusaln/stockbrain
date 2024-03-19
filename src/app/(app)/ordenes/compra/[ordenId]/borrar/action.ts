"use server";

import { deleteOrdenCompra } from "@/lib/queries";
import { RedirectType, redirect } from "next/navigation";

export async function borrarOrdenCompra(ordenId: number, prevState: any, formData: FormData) {
    await deleteOrdenCompra(ordenId);

    redirect(
        "/ordenes/compra?" + new URLSearchParams({ "message[success]": "Orden borrada con éxito" }),
        RedirectType.push,
    );
}
