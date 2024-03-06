import { Loader } from "@/components/Loader";
import ResponsiveLayout from "@/components/layouts/ResponsiveLayout";

export default function Loading() {
    return (
        <ResponsiveLayout title="Cargando">
        <Loader></Loader>
        </ResponsiveLayout>
    );
}
