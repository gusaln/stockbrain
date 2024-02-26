export interface OrdenConsumo {
    id: number;
    direccion: string;
    fecha: string;
}

export interface OrdenConsumoItem {
    id: number;
    almacenId: number;
    productoId: number;
    cantidad: number;
    precioUnitario: number;
    total: number;
}
