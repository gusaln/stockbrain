import { Loader } from "@/components/Loader";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import Providers from "../providers";
import { authenticate } from "@/lib/auth";
import { ROL } from "@/lib/queries";
import { logout } from "../(auth)/actions";
import { redirect } from "next/navigation";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await authenticate();

    if (!user?.esAdmin) {
        redirect("/");
    }

    return { children };
}
