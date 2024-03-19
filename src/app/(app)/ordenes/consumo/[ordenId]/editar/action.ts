"use server";

import { authenticateOrFail } from "@/lib/auth";
import {
    createOrdenConsumoItem,
    deleteOrdenConsumoItem,
    getOrdenConsumoItems,
    updateOrdenConsumo,
    updateOrdenConsumoItem,
} from "@/lib/queries";
import { z } from "@/validation";
import { revalidatePath } from "next/cache";
import { RedirectType, redirect } from "next/navigation";

const editarOrdenSchema = z.object({
    fecha: z.string().trim().max(64).datetime({ offset: true }),
    descripcion: z.string().trim().max(128),
});

export async function editarOrdenConsumo(ordenId: number, prevState: any, formData: FormData) {
    const validatedFields = editarOrdenSchema.safeParse({
        fecha: formData.get("fecha") + "T00:00:00-04",
    });

    // Return early if the form data is invalid
    if (!validatedFields.success) {
        return {
            messages: {
                error: "Datos inválidos",
            },
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const user = await authenticateOrFail();

    await updateOrdenConsumo(ordenId, validatedFields.data, user.id);

    revalidatePath(`/ordenes/consumo`);
    redirect(
        `/ordenes/consumo/${ordenId}/editar?` +
            new URLSearchParams({
                "message[success]": "Orden de consumo modificada con éxito",
            }),
        RedirectType.push,
    );
}

const editarOrdenItemSchema = z.object({
    productoId: z.number().int().positive(),
    almacenId: z.number().int().positive(),
    cantidad: z.number().int().positive(),
});

export async function editarOrdenConsumoItem(itemId: number, prevState: any, formData: FormData) {
    const validatedFields = editarOrdenItemSchema.safeParse({
        productoId: parseInt((formData.get("productoId") as string) ?? ""),
        almacenId: parseInt((formData.get("almacenId") as string) ?? ""),
        cantidad: parseInt((formData.get("cantidad") as string) ?? "0"),
    });

    // Return early if the form data is invalid
    if (!validatedFields.success) {
        return {
            messages: {
                error: "Datos inválidos",
            },
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const user = await authenticateOrFail();

    const ordenId = await updateOrdenConsumoItem(itemId, validatedFields.data, user.id);

    return {
        messages: {
            success: "Item modificado con éxito",
        },
        errors: null,
    };
}

const crearOrdenItemSchema = z.object({
    productoId: z.number().int().positive(),
    almacenId: z.number().int().positive(),
    cantidad: z.number().int().positive(),
});

export async function crearOrdenConsumoItem(ordenId: number, prevState: any, formData: FormData) {
    const validatedFields = crearOrdenItemSchema.safeParse({
        productoId: parseInt((formData.get("productoId") as string) ?? ""),
        almacenId: parseInt((formData.get("almacenId") as string) ?? ""),
        cantidad: parseInt((formData.get("cantidad") as string) ?? "0"),
    });

    // Return early if the form data is invalid
    if (!validatedFields.success) {
        return {
            messages: {
                error: "Datos inválidos",
            },
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const user = await authenticateOrFail();

    await createOrdenConsumoItem(ordenId, validatedFields.data, user.id);

    revalidatePath(`/ordenes/consumo`);
    redirect(
        `/ordenes/consumo/${ordenId}/editar?` +
            new URLSearchParams({
                "message[success]": "Item creado con éxito",
            }),
        RedirectType.push,
    );
}

export async function borrarOrdenConsumoItem(ordenId: number, itemId: number, prevState: any, formData: FormData) {
    const items = await getOrdenConsumoItems(ordenId);
    if (items.length < 2) {
        return {
            messages: {
                error: "No puede borra el último item de la orden",
            },
            errors: null,
        };
    }

    await deleteOrdenConsumoItem(itemId);
    revalidatePath(`/ordenes/consumo`);
    redirect(
        `/ordenes/consumo/${ordenId}/editar?` +
            new URLSearchParams({
                "message[success]": "Item borrado con éxito",
            }),
        RedirectType.push,
    );
}
