const AJUSTE_INVENTARIO_TIPO = {
    ENTRADA: 1,
    SALIDA: 2,
} as const;
type AjusteInventarioTipoEnum = typeof AJUSTE_INVENTARIO_TIPO;
type AjusteInventarioTipo = AjusteInventarioTipoEnum[keyof AjusteInventarioTipoEnum];

export interface AjusteInventario {
    id: number;
    operadorId: number;
    fecha: string;
    almacenId: number;
    productoId: number;
    tipo: AjusteInventarioTipo;
    cantidad: number;
    motivo: string;
}
