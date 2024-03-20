"use server";

import { authenticateOrFail } from "@/lib/auth";
import { updateAjusteInventario } from "@/lib/queries";
import { updateTransferencia } from "@/lib/queries/transferencias";
import { z } from "@/validation";
import { redirect } from "next/navigation";

const schema = z.object({
    fecha: z.string().trim().max(64).datetime({ offset: true }),
    almacenOrigenId: z.number().int().positive(),
    almacenDestinoId: z.number().int().positive(),
    productoId: z.number().int().positive(),
    estadoOrigen: z.number().int().positive(),
    estadoDestino: z.number().int().positive(),
    cantidad: z.number(),
});

export async function editarTransferencia(movimientoId: number, prevState: any, formData: FormData) {
    const validatedFields = schema.safeParse({
        fecha: formData.get("fecha") + "T00:00:00-04",
        almacenOrigenId: parseInt(formData.get("almacenOrigenId") as string),
        almacenDestinoId: parseInt(formData.get("almacenDestinoId") as string),
        productoId: parseInt(formData.get("productoId") as string),
        estadoOrigen: parseInt(formData.get("estadoOrigen") as string),
        estadoDestino: parseInt(formData.get("estadoDestino") as string),
        cantidad: parseInt(formData.get("cantidad") as string),
    });

    if (!validatedFields.success) {
        return {
            messages: {
                error: "Datos inválidos",
            },
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const user = await authenticateOrFail();

    await updateTransferencia(movimientoId, validatedFields.data, user.id);

    redirect("/transferencias?" + new URLSearchParams({ "message[success]": "Transferencia editado con éxito" }));
}
