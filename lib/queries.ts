import { connection, createConnection } from "./db";
import { createHash } from "crypto"

interface Categoria {
    id: number;
    nombre: string;
    descripcion: string;
}

interface Proveedor {
    id: number;
    nombre: string;
    /** Persona de contacto en el proveedor */
    contacto: string;
    telefono: string;
    email: string;
    direccion: string;
}

interface Almacen {
    id: number;
    nombre: string;
    ubicacion: string;
    /** Persona a cargo del almacén */
    encargado: string;
}

const ROL = {
    "administrador": 1,
    "almacenero": 2,
    "tecnico": 3,
} as const
type RolEnum = (typeof ROL)
type Rol = RolEnum[keyof RolEnum]
interface Usuario {
    id: number;
    nombre: string;
    email: string;
    password: string;
    rol: Rol;
}

/** Ente a quién el departamento de redes le presta servicio */
interface Cliente {
    id: number;
    nombre: string;
    responsable: string;
    ubicacion: string
}

interface Producto {
    id: number;
    categoriaId: string;
    proveedorId: string;
    nombre: string; // Es esto necesario si tenemos la marca y el modelo?
    descripcion: string;
    marca: string;
    modelo: string;
    precio: string; // qué pasa si se compraron cosas a distintos precios?
    imagen: string | null;
    stock: number;
    ubicacion: string; // si el producto puede estar en varios almacenes, esta propiedad no tiene sentido.
}

interface OrdenCompra {
    id: number;
    direccion: string;
    fecha: string;
}

interface OrdenCompraItem {
    id: number;
    almacenId: number;
    productoId: number;
    cantidad: number;
    precioUnitario: number;
    total: number
}

interface OrdenConsumo {
    id: number;
    direccion: string;
    fecha: string;
}

interface OrdenConsumoItem {
    id: number;
    almacenId: number;
    productoId: number;
    cantidad: number;
    precioUnitario: number;
    total: number
}

const AJUSTE_INVENTARIO_TIPO = {
    "ENTRADA": 1,
    "SALIDA": 2,
} as const
type AjusteInventarioTipoEnum = (typeof AJUSTE_INVENTARIO_TIPO)
type AjusteInventarioTipo = AjusteInventarioTipoEnum[keyof AjusteInventarioTipoEnum]

interface AjusteInventario {
    id: number;
    operadorId: number;
    fecha: string;
    almacenId: number;
    productoId: number;
    tipo: AjusteInventarioTipo;
    cantidad: number;
    motivo: string;
}

const MOVIMIENTO_INVENTARIO_TIPO = {
    "ENTRADA": 1,
    "SALIDA": 2,
    "TRANSFERENCIA": 3,
    "AJUSTE": 4,
} as const
type MovimientoInventarioTipoEnum = (typeof MOVIMIENTO_INVENTARIO_TIPO)
type MovimientoInventarioTipo = MovimientoInventarioTipoEnum[keyof MovimientoInventarioTipoEnum]

interface MovimientoInventario {
    id: number;
    fecha: string;
    productoId: number;
    tipo: MovimientoInventarioTipo;
    cantidad: number;
    almacenOrigenId: number;
    almacenDestinoId: number | null; // Sólo se usaría para las transferencias ?
}


export async function createUsuario(
    nombre: string,
    email: string,
    password: string,
    rol: Rol,
) {
    const hash = createHash('sha256');
    hash.update(password)

    const connection = await createConnection();

    const [result, fields] = await connection.query(
        "INSERTO INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ? ,?)",
        [nombre, email, hash.digest('hex'), rol]
    )

    console.log(result);
    console.log(fields);

    return
}