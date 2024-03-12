import ResponsiveLayout from "@/components/layouts/ResponsiveLayout";
import { authenticate } from "@/lib/auth";
import { redirect } from "next/navigation";
import { login } from "../actions";
import { LoginForm } from "./LoginForm";

export default async function Login() {
    const user = await authenticate();

    if (user) {
        redirect("/");
    }

    return (
        <ResponsiveLayout>
            <section className="card w-2/6 shadow-md mx-auto">
                <div className="card-body">
                    <LoginForm onSubmit={login} />
                </div>
            </section>
        </ResponsiveLayout>
    );
}
