export interface Almacen {
    id: number;
    nombre: string;
    ubicacion: string;
    /** Persona a cargo del almacén */
    encargado: string;
}
