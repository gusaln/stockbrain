export interface Producto {
    id: number;
    categoriaId: number;
    // proveedorId: number;
    // nombre: string;
    marca: string;
    modelo: string;
    descripcion: string;
    // precio: string; // qué pasa si se compraron cosas a distintos precios?
    imagen: string | null;
}

const ESTADO = {
    bueno: 1,
    revision: 2,
    defectuoso: 3,
} as const;
type EstadoEnum = typeof ESTADO;
type Estado = EstadoEnum[keyof EstadoEnum];

export interface ProductoStock {
    id: number;
    productoId: number;
    identificador: string;
    estado: Estado;
    cantidad: number;
}