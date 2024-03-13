"use server";

import { signIn, signOut } from "@/lib/auth";
import { z } from "@/validation";
import { redirect } from "next/navigation";

const schema = z.object({
    email: z.string().trim().email().max(128),
    password: z.string().trim().max(64),
});

export async function login(_state: unknown, formData: FormData) {
    const validatedFields = schema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    // Return early if the form data is invalid
    if (!validatedFields.success) {
        console.error(validatedFields.error.message, validatedFields.error.flatten().fieldErrors);

        return {
            message: "Datos inválidos",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const user = await signIn(validatedFields.data);
        if (user) {
            redirect("/");
        }
        // await createUsuario("Gustavo", "glopez.2b@gmail.com", "123456", ROL.administrador);
    } catch (error) {
        console.error(error);

        if (error.message.includes("CredentialsSignin")) {
            return {
                message: "Credenciales desconocidas",
                errors: null,
            };
        }

        throw error;
    }

    return {
        message: "Credenciales desconocidas",
        errors: null,
    };
}

export async function logout() {
    await signOut();
    redirect("/login");
}
