import ResponsiveLayout, {LinkAction} from "@/components/layouts/ResponsiveLayout";
import { ProductosTable } from "./ProductosTable";

export default function Page() {
    return (
        <ResponsiveLayout 
            title="Productos" 
            acciones={() => { 
                return <LinkAction href="/productos/crear">Registrar</LinkAction>;
            }}
        >
            <section className="card w-full shadow-md">
                <div className="card-body">
                    <div className="flex justify-center">
                        <ProductosTable />
                    </div>
                </div>    
            </section>    
        </ResponsiveLayout>
    );
}
