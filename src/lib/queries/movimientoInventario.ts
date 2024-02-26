const MOVIMIENTO_INVENTARIO_TIPO = {
    ENTRADA: 1,
    SALIDA: 2,
    TRANSFERENCIA: 3,
    AJUSTE: 4,
} as const;
type MovimientoInventarioTipoEnum = typeof MOVIMIENTO_INVENTARIO_TIPO;
type MovimientoInventarioTipo = MovimientoInventarioTipoEnum[keyof MovimientoInventarioTipoEnum];

export interface MovimientoInventario {
    id: number;
    fecha: string;
    productoId: number;
    tipo: MovimientoInventarioTipo;
    cantidad: number;
    almacenOrigenId: number;
    almacenDestinoId: number | null; // Sólo se usaría para las transferencias ?
}
