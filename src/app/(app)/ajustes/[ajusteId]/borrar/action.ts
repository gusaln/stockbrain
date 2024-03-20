"use server";

import { deleteAjuste, deleteOrdenCompra } from "@/lib/queries";
import { RedirectType, redirect } from "next/navigation";

export async function borrarAjuste(ajusteId: number, prevState: any, formData: FormData) {
    await deleteAjuste(ajusteId);

    redirect(
        "/ajustes?" + new URLSearchParams({ "message[success]": "Ajuste borrado con éxito" }),
        RedirectType.push,
    );
}
