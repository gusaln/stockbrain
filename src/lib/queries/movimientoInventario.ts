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
    operadorId: number;
    productoId: number;
    estadoOrigenId: number | null; // Sólo se usaría para las transferencias ?
    estadoDestinoId: number | null;
    tipo: MovimientoInventarioTipo;
    relacionId: number | null;
    cantidad: number;
}
