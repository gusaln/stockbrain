"use server";

import { authenticateOrFail } from "@/lib/auth";
import {
    createOrdenCompraItem,
    deleteOrdenCompraItem,
    getOrdenCompraItems,
    updateOrdenCompra,
    updateOrdenCompraItem,
} from "@/lib/queries";
import { z } from "@/validation";
import { revalidatePath } from "next/cache";
import { RedirectType, redirect } from "next/navigation";

const editarOrdenSchema = z.object({
    proveedorId: z.number().int().positive(),
    fecha: z.string().trim().max(64).datetime({ offset: true }),
});

export async function editarOrdenCompra(ordenId: number, prevState: any, formData: FormData) {
    const validatedFields = editarOrdenSchema.safeParse({
        proveedorId: parseInt(formData.get("proveedorId") as string),
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

    await updateOrdenCompra(ordenId, validatedFields.data, user.id);

    revalidatePath(`/ordenes/compra`);
    redirect(
        `/ordenes/compra/${ordenId}/editar?` +
            new URLSearchParams({
                "message[success]": "Orden de compra modificada con éxito",
            }),
        RedirectType.push,
    );
}

const editarOrdenItemSchema = z.object({
    productoId: z.number().int().positive(),
    almacenId: z.number().int().positive(),
    precioUnitario: z.number().positive(),
    cantidad: z.number().int().positive(),
});

export async function editarOrdenCompraItem(itemId: number, prevState: any, formData: FormData) {
    const validatedFields = editarOrdenItemSchema.safeParse({
        productoId: parseInt((formData.get("productoId") as string) ?? ""),
        almacenId: parseInt((formData.get("almacenId") as string) ?? ""),
        precioUnitario: parseFloat((formData.get("precioUnitario") as string) ?? "0"),
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

    const ordenId = await updateOrdenCompraItem(itemId, validatedFields.data, user.id);

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
    precioUnitario: z.number().positive(),
    cantidad: z.number().int().positive(),
});

export async function crearOrdenCompraItem(ordenId: number, prevState: any, formData: FormData) {
    const validatedFields = crearOrdenItemSchema.safeParse({
        productoId: parseInt((formData.get("productoId") as string) ?? ""),
        almacenId: parseInt((formData.get("almacenId") as string) ?? ""),
        precioUnitario: parseFloat((formData.get("precioUnitario") as string) ?? "0"),
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

    await createOrdenCompraItem(ordenId, validatedFields.data, user.id);

    revalidatePath(`/ordenes/compra`);
    redirect(
        `/ordenes/compra/${ordenId}/editar?` +
            new URLSearchParams({
                "message[success]": "Item creado con éxito",
            }),
        RedirectType.push,
    );
}

export async function borrarOrdenCompraItem(ordenId: number, itemId: number, prevState: any, formData: FormData) {
    const items = await getOrdenCompraItems(ordenId);
    if (items.length < 2) {
        return {
            messages: {
                error: "No puede borra el último item de la orden",
            },
            errors: null,
        };
    }

    await deleteOrdenCompraItem(itemId);
    revalidatePath(`/ordenes/compra`);
    redirect(
        `/ordenes/compra/${ordenId}/editar?` +
            new URLSearchParams({
                "message[success]": "Item borrado con éxito",
            }),
        RedirectType.push,
    );
}
