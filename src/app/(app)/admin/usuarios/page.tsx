import { UsuarioTable } from "./UsuariosTable";
import ResponsiveLayout, {LinkAction} from "@/components/layouts/ResponsiveLayout";

export default function Page() {
    return (
        <ResponsiveLayout
            title = "Usuarios"
            acciones = {() =>{
                return <LinkAction href="/usuarios/crear">Crear</LinkAction>
            }}
        >
            <section className="card w-full shadow-md">
                <div className="card-body">
                    <UsuarioTable />
                </div>
            </section>
        </ResponsiveLayout>    
    );
}
