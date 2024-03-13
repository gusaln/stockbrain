import { authenticate } from "@/lib/auth";
import { ROL } from "@/lib/queries";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export default async function middleware(request: NextRequest) {
    const user = await authenticate();
    const isOnAdminPanel = request.nextUrl?.pathname.search("/admin");
    const isOnLoginPage = request.nextUrl?.pathname.startsWith("/login");

    console.log({
        user,
        isOnAdminPanel,
        isOnLoginPage,
    });

    if (isOnLoginPage) {
        if (!user) {
            return NextResponse.next();
        }

        return NextResponse.rewrite(new URL("/", request.url));
    }

    if (!user) {
        return NextResponse.rewrite(new URL("/login", request.url));
    }

    if (isOnAdminPanel && user.rol != ROL.administrador) {
        return NextResponse.rewrite(new URL("/", request.url));
    }

    return NextResponse.next();
}
