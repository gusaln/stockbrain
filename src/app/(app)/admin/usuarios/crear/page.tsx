import { CrearUsuarioForm } from "./CrearUsuarioForm";
import { crearUsuario } from "./action";

export default function Page() {
    return (
        <div className="w-4/5 mx-auto">
            <h1 className="font-semibold underline decoration-wavy decoration-primary underline-offset-4">Usuarios</h1>

            <section className="flex justify-end space-x-2 mb-4">
                <a role="button" className="btn" href="/usuarios">
                    Volver
                </a>
            </section>

            <section className="w-full justify-center flex">
                <div className="card w-fit shadow-lg">
                    <CrearUsuarioForm onSubmit={crearUsuario} />
                </div>
            </section>
        </div>
    );
}
