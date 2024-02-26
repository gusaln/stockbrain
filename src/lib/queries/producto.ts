export interface Producto {
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
