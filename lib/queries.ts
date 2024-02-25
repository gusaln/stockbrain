interface Categoria {
    id: number;
    nombre: string;
}

interface Usuario {
    id: number;
    nombre: string;
    email: string;
    password: string;
}

interface Cliente {
    id: number;
    rif: string;
    nombre: string;
    apellido: string;
}

interface Proveedor {
    id: number;
    empresa: string;
    rif: string;
    celular: string;
}

interface Almacen {
    id: number;
    nombre: string;
    direccion: string;
}

interface Producto {
    id: number;
    sku: string;
    detalles: string;
    precio: number;
}

interface Ajuste {
    id: number;
    operadorId: number;
    productoId: number;
    almacenId: number;
    direccion: string;
    fecha: string;
    cantidad: number;
}

interface OrdenCompra {
    id: number;
    operadorId: number;
    productoId: number;
    almacenId: number;
    direccion: string;
    fecha: string;
    cantidad: number;
}