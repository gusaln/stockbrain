"use server";

import { deleteOrdenConsumo } from "@/lib/queries";
import { RedirectType, redirect } from "next/navigation";

export async function borrarOrdenConsumo(ordenId: number, prevState: any, formData: FormData) {
    await deleteOrdenConsumo(ordenId);

    redirect(
        "/ordenes/consumo?" + new URLSearchParams({ "message[success]": "Orden borrada con éxito" }),
        RedirectType.push,
    );
}
