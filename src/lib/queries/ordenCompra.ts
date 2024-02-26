export interface OrdenCompra {
    id: number;
    direccion: string;
    fecha: string;
}

export interface OrdenCompraItem {
    id: number;
    almacenId: number;
    productoId: number;
    cantidad: number;
    precioUnitario: number;
    total: number;
}
