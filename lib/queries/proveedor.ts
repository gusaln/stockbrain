export interface Proveedor {
    id: number;
    nombre: string;
    /** Persona de contacto en el proveedor */
    contacto: string;
    telefono: string;
    email: string;
    direccion: string;
}