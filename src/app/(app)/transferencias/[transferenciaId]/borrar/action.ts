"use server";

import { deleteOrdenCompra } from "@/lib/queries";
import { RedirectType, redirect } from "next/navigation";

export async function borrarTransferencia(transferenciaId: number, prevState: any, formData: FormData) {
    await deleteOrdenCompra(transferenciaId);

    redirect(
        "/transferencias?" + new URLSearchParams({ "message[success]": "Transferencia borrada con éxito" }),
        RedirectType.push,
    );
}
