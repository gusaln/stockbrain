export interface OrdenCompra {
    id: number;
    proveedorId: number;
    fecha: string;
    operadorId: number;
}

export interface OrdenCompraItem {
    id: number;
    ordenId: number;
    productoId: number;
    cantidad: number;
    precioUnitario: number;
    total: number;
}
