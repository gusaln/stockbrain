export interface OrdenConsumo {
    id: number;
    descripcion: string;
    fecha: string;
    operadorId: number;
}

export interface OrdenConsumoItem {
    id: number;
    ordenId: number;
    productoId: number;
    cantidad: number;
    // precioUnitario: number;
    // total: number;
}
