export interface Categoria {
    id: number;
    nombre: string;
    descripcion: string;
}

export interface Proveedor {
    id: number;
    nombre: string;
    /** Persona de contacto en el proveedor */
    contacto: string;
    telefono: string;
    email: string;
    direccion: string;
}

export interface Almacen {
    id: number;
    nombre: string;
    ubicacion: string;
    /** Persona a cargo del almacén */
    encargado: string;
}

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

export function getProductoEstadoLabel(estado: ProductoEstado) {
    switch (estado) {
        case PRODUCTO_ESTADO.BUENO:
            return "bueno";

        case PRODUCTO_ESTADO.REVISION:
            return "en revisión";

        case PRODUCTO_ESTADO.DEFECTUOSO:
            return "defectuoso";

        default:
            return "";
    }
}

export interface ProductoStock {
    id: number;
    almacenId: number;
    productoId: number;
    identificador: string;
    estado: ProductoEstado;
    cantidad: number;
}

export const PRODUCTO_ESTADO = {
    BUENO: 1,
    REVISION: 2,
    DEFECTUOSO: 3,
} as const;
type ProductoEstadoEnum = typeof PRODUCTO_ESTADO;
export type ProductoEstado = ProductoEstadoEnum[keyof ProductoEstadoEnum];
export const ProductoEstadoLabelMap = new Map(
    Object.entries(PRODUCTO_ESTADO).map(([k, v]) => [v, k as keyof ProductoEstadoEnum]),
);

export interface OrdenCompra {
    id: number;
    proveedorId: number;
    fecha: string;
    operadorId: number;
}

export interface OrdenCompraItem {
    id: number;
    ordenId: number;
    almacenId: number;
    productoId: number;
    cantidad: number;
    precioUnitario: number;
    total: number;
}

export interface OrdenConsumo {
    id: number;
    descripcion: string;
    fecha: string;
    operadorId: number;
}

export interface OrdenConsumoItem {
    id: number;
    ordenId: number;
    almacenId: number;
    productoId: number;
    cantidad: number;
}

export const AJUSTE_INVENTARIO_TIPO = {
    ENTRADA: 1,
    SALIDA: 2,
} as const;

type AjusteInventarioTipoEnum = typeof AJUSTE_INVENTARIO_TIPO;
export type AjusteInventarioTipo = AjusteInventarioTipoEnum[keyof AjusteInventarioTipoEnum];
export const AjusteInventarioTipoMap = new Map(
    Object.entries(AJUSTE_INVENTARIO_TIPO).map(([k, v]) => [v, k as keyof AjusteInventarioTipoEnum]),
);

export interface AjusteInventario {
    id: number;
    operadorId: number;
    fecha: string;
    almacenId: number;
    productoId: number;
    estado: ProductoEstado;
    tipo: AjusteInventarioTipo;
    cantidad: number;
    motivo: string;
}

export const MOVIMIENTO_INVENTARIO_TIPO = {
    ENTRADA: 1,
    SALIDA: 2,
    TRANSFERENCIA: 3,
    AJUSTE: 4,
} as const;
type MovimientoInventarioTipoEnum = typeof MOVIMIENTO_INVENTARIO_TIPO;
export type MovimientoInventarioTipo = MovimientoInventarioTipoEnum[keyof MovimientoInventarioTipoEnum];
export const MovimientoInventarioTipoLabelMap = new Map(
    Object.entries(MOVIMIENTO_INVENTARIO_TIPO).map(([k, v]) => [v, k as keyof MovimientoInventarioTipoEnum]),
);

export type MovimientoInventario = {
    id: number;
    fecha: string;
    operadorId: number;
    almacenDestinoId: number;
    productoId: number;
    estadoDestino: ProductoEstado;
    tipo: MovimientoInventarioTipo;
    ajusteId: number | null;
    ordenCompraId: number | null;
    ordenConsumoId: number | null;
    cantidad: number;
} & (
    | {
          almacenOrigenId: number;
          estadoOrigen: ProductoEstado;
      }
    | {
          almacenOrigenId: null;
          estadoOrigen: null;
      }
);

export type Transferencia = MovimientoInventario & {
    tipo: typeof MOVIMIENTO_INVENTARIO_TIPO.TRANSFERENCIA;
    almacenDestinoId: number;
    estadoDestino: ProductoEstado;
};

export type MovimientoInventarioWithRelations = {
    id: number;
    fecha: string;
    operadorId: number;
    operador: {
        id: number;
        nombre: string;
    };
    almacenDestinoId: number;
    almacenDestino: {
        id: number;
        nombre: string;
    };
    productoId: number;
    producto: {
        id: number;
        marca: string;
        modelo: string;
    };
    estadoDestino: ProductoEstado;
    tipo: MovimientoInventarioTipo;
    tipoNombre: string;
    ajusteId: number | null;
    ordenCompraId: number | null;
    ordenConsumoId: number | null;
    cantidad: number;
} & (
    | {
          almacenOrigenId: number;
          almacenOrigen: {
              id: number;
              nombre: string;
          };
          estadoOrigen: ProductoEstado;
      }
    | {
          almacenOrigenId: null;
          almacenOrigen: null;
          estadoOrigen: null;
      }
);
