import ResponsiveLayout, {LinkAction} from "@/components/layouts/ResponsiveLayout";
import { ProductosTable } from "./ProductosTable";

export default function Users() {
    return (
        <ResponsiveLayout 
            title="Productos" 
            acciones={() => { 
                return <LinkAction href="/productos/crear">Registrar</LinkAction>;
            }}
        >
            <section className="card w-full shadow-md">
                <div className="card-body">
                    <ProductosTable />
                </div>    
            </section>    
        </ResponsiveLayout>
    );
}
