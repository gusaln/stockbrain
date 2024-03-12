import { SessionOptions, getIronSession } from "iron-session";
import { ROL, findUsuarioById, usuarioExiste } from "./queries";

import { cookies } from "next/headers";

const COOKIE_NAME = "__session";
const SESSION_SECRET = "ERdlvNCLrtST5DwBCSUs4ZG8TcURMETvPiQwW3n2n4M=";
const sessionConfig = { password: SESSION_SECRET, cookieName: COOKIE_NAME } satisfies SessionOptions;

interface Credentials {
    email: string;
    password: string;
}

interface SessionData {
    userId?: number;
}

export async function authenticate() {
    const session = await getIronSession<SessionData>(cookies(), sessionConfig);

    console.log("session", { session });

    if (!session.userId) {
        return null;
    }
    const user = await findUsuarioById(session.userId);
    if (!user) {
        return null;
    }

    return {
        ...user,
        esAdmin: user.rol == ROL.administrador,
    };
}

export async function signIn(credentials: Credentials) {
    const user = await usuarioExiste(credentials.email, credentials.password);

    if (!user) {
        return null;
    }

    const oldSession = await getIronSession<SessionData>(cookies(), sessionConfig);
    oldSession.destroy();

    const newSession = await getIronSession<SessionData>(cookies(), sessionConfig);
    newSession.userId = user.id;
    await newSession.save();

    return user;
}

export async function signOut() {
    const oldSession = await getIronSession<SessionData>(cookies(), sessionConfig);
    oldSession.destroy();
}

// declare module "next-auth" {
//     interface User extends Usuario {}
// }

// const nextAuth = NextAuth({
//     providers: [
//         CredentialsProvider({
//             name: "Credentials",
//             async authorize(credentials, request) {
//                 const user = await usuarioExiste(credentials.email as string, credentials.password as string);

//                 if (!user) {
//                     throw new Error("usuario desconocido");
//                 }

//                 return user;
//             },
//         }),
//     ],
//     callbacks: {
//         // async session({ session, token }) {
//         //     if (token) {
//         //         session.user.id = token.id;
//         //         session.user.isAdmin = token.isAdmin;
//         //     }
//         //     return session;
//         // },
//         authorized({ auth, request }) {
//             const user = auth?.user;
//             const isOnAdminPanel = request.nextUrl?.pathname.search("/admin");
//             const isOnLoginPage = request.nextUrl?.pathname.startsWith("/login");

//             if (!user) {
//                 return isOnLoginPage;
//             } else if (isOnLoginPage) {
//                 return Response.redirect(new URL("/", request.nextUrl));
//             }

//             if (isOnAdminPanel && user.rol != ROL.administrador) {
//                 return false;
//             }

//             return true;
//         },
//     },
// });

// export const { signIn, signOut, auth, handlers } = nextAuth;
