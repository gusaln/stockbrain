-- DROP DATABASE IF EXISTS `stockbrain`;
CREATE DATABASE IF NOT EXISTS `stockbrain`;

-- Referencia de tamaño
--  32 caracteres 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
--  64 caracteres 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
-- 128 caracteres 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
USE `stockbrain`;

SET
    foreign_key_checks = 0;

DROP TABLE IF EXISTS `usuarios`;

CREATE TABLE
    `usuarios` (
        `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
        `nombre` VARCHAR(64),
        `email` VARCHAR(128) UNIQUE,
        `password` VARCHAR(128),
        `rol` INT
    );

DROP TABLE IF EXISTS `almacenes`;

CREATE TABLE
    `almacenes` (
        `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
        `nombre` VARCHAR(64),
        `ubicacion` VARCHAR(64)
    );

DROP TABLE IF EXISTS `categorias`;

CREATE TABLE
    `categorias` (
        `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
        `nombre` VARCHAR(64),
        `descripcion` VARCHAR(128)
    );

DROP TABLE IF EXISTS `proveedores`;

CREATE TABLE
    `proveedores` (
        `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
        `nombre` VARCHAR(64),
        `contacto` VARCHAR(64),
        `telefono` VARCHAR(32),
        `email` VARCHAR(128),
        `direccion` VARCHAR(128)
    );

DROP TABLE IF EXISTS `productos`;

CREATE TABLE
    `productos` (
        `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
        `categoriaId` BIGINT,
        `marca` VARCHAR(128),
        `modelo` VARCHAR(128),
        `descripcion` VARCHAR(128),
        `imagen` VARCHAR(128) NULL,
        FOREIGN KEY (`categoriaId`) REFERENCES `categorias` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT
    );

DROP TABLE IF EXISTS `productoStocks`;

CREATE TABLE
    `productoStocks` (
        `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
        `almacenId` BIGINT,
        `productoId` BIGINT,
        `identificador` VARCHAR(128),
        `estado` TINYINT,
        `cantidad` BIGINT,
        UNIQUE (`almacenId`, `productoId`, `estado`),
        FOREIGN KEY (`productoId`) REFERENCES `productos` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
        FOREIGN KEY (`almacenId`) REFERENCES `almacenes` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT
    );

DROP TABLE IF EXISTS `ordenesCompra`;

CREATE TABLE
    `ordenesCompra` (
        `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
        `proveedorId` BIGINT,
        `fecha` TIMESTAMP,
        `operadorId` BIGINT,
        FOREIGN KEY (`operadorId`) REFERENCES `usuarios` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
        FOREIGN KEY (`proveedorId`) REFERENCES `proveedores` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT
    );

DROP TABLE IF EXISTS `ordenesCompraItems`;

CREATE TABLE
    `ordenesCompraItems` (
        `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
        `ordenId` BIGINT,
        `almacenId` BIGINT,
        `productoId` BIGINT,
        `cantidad` INT,
        `precioUnitario` DECIMAL(10, 2),
        `total` DECIMAL(10, 2),
        FOREIGN KEY (`ordenId`) REFERENCES `ordenesCompra` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
        FOREIGN KEY (`almacenId`) REFERENCES `almacenes` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
        FOREIGN KEY (`productoId`) REFERENCES `productos` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT
    );

DROP TABLE IF EXISTS `ordenesConsumo`;

CREATE TABLE
    `ordenesConsumo` (
        `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
        `descripcion` VARCHAR(128),
        `fecha` TIMESTAMP,
        `operadorId` BIGINT,
        FOREIGN KEY (`operadorId`) REFERENCES `usuarios` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT
    );

DROP TABLE IF EXISTS `ordenesConsumoItems`;

CREATE TABLE
    `ordenesConsumoItems` (
        `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
        `ordenId` BIGINT,
        `almacenId` BIGINT,
        `productoId` BIGINT,
        `cantidad` INT,
        FOREIGN KEY (`ordenId`) REFERENCES `ordenesCompra` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
        FOREIGN KEY (`almacenId`) REFERENCES `almacenes` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
        FOREIGN KEY (`productoId`) REFERENCES `productos` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT
    );

DROP TABLE IF EXISTS `ajustesInventario`;

CREATE TABLE
    `ajustesInventario` (
        `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
        `operadorId` BIGINT,
        `fecha` TIMESTAMP,
        `almacenId` BIGINT,
        `productoId` BIGINT,
        `estado` TINYINT,
        `tipo` INT,
        `cantidad` INT,
        `motivo` VARCHAR(256),
        FOREIGN KEY (`operadorId`) REFERENCES `usuarios` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
        FOREIGN KEY (`almacenId`) REFERENCES `almacenes` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
        FOREIGN KEY (`productoId`) REFERENCES `productos` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT
    );

DROP TABLE IF EXISTS `movimientosInventario`;

CREATE TABLE
    `movimientosInventario` (
        `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
        `fecha` TIMESTAMP,
        `operadorId` BIGINT,
        `almacenOrigenId` BIGINT NULL,
        `almacenDestinoId` BIGINT,
        `productoId` BIGINT,
        `estadoOrigen` BIGINT NULL,
        `estadoDestino` BIGINT,
        `tipo` INT,
        `ordenCompraId` BIGINT NULL,
        `ordenConsumoId` BIGINT NULL,
        `ajusteId` BIGINT NULL,
        `cantidad` INT,
        `fueEditada` TINYINT DEFAULT FALSE,
        FOREIGN KEY (`operadorId`) REFERENCES `usuarios` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
        FOREIGN KEY (`almacenOrigenId`) REFERENCES `almacenes` (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (`almacenDestinoId`) REFERENCES `almacenes` (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (`productoId`) REFERENCES `productos` (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (`ordenCompraId`) REFERENCES `ordenesCompra` (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (`ordenConsumoId`) REFERENCES `ordenConsumoId` (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (`ajusteId`) REFERENCES `ajustesInventario` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
    );

SET
    foreign_key_checks = 1;

-- Seed usuarios
INSERT INTO
    `usuarios` (`id`, `nombre`, `email`, `password`, `rol`)
VALUES
    -- password 123456
    (
        1,
        "Admin",
        "admin@example.com",
        "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
        1
    ),
    (
        2,
        "María Chang",
        "almacen1@example.com",
        "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
        2
    );

-- Seed almacenes
INSERT INTO
    `almacenes` (`id`, `nombre`, `ubicacion`)
VALUES
    (1, "Almacén 1", "4452");

-- Seed categorías
INSERT INTO
    `categorias` (`id`, `nombre`, `descripcion`)
VALUES
    (1, "Routers", "Enrutamiento de datos."),
    (
        2,
        "Switches",
        "Conexión de dispositivos en una red local."
    ),
    (
        3,
        "Servidores",
        "Alto rendimiento para datos y aplicaciones."
    ),
    (4, "CPUs", "Procesadores."),
    (5, "Cableado", "Conexiones.");

-- Seed proveedores
INSERT INTO
    `proveedores` (
        `nombre`,
        `contacto`,
        `telefono`,
        `email`,
        `direccion`
    )
VALUES
    (
        "Suministros Bolívar",
        "Juan Pérez",
        "+58 212-1234567",
        "juan.perez@suministrosbolivar.com",
        "Av. Universidad, Caracas, Venezuela"
    ),
    (
        "Importaciones Maracaibo",
        "María Rodríguez",
        "+58 261-2345678",
        "maria.rodriguez@importacionesmaracaibo.com",
        "Calle 72, Maracaibo, Venezuela"
    ),
    (
        "Distribuidora Valencia",
        "Carlos González",
        "+58 241-3456789",
        "carlos.gonzalez@distribuidoravalencia.com",
        "Av. Bolívar Norte, Valencia, Venezuela"
    ),
    (
        "Comercializadora Barquisimeto",
        "Ana Martínez",
        "+58 251-4567890",
        "ana.martinez@comercializadorabarquisimeto.com",
        "Carrera 19, Barquisimeto, Venezuela"
    ),
    (
        "Proveedora Maracay",
        "Luis Ramírez",
        "+58 243-5678901",
        "luis.ramirez@proveedoramaracay.com",
        "Av. Constitución, Maracay, Venezuela"
    ),
    (
        "Microred CA",
        "Miguel Angel Pereira",
        "0414-9724567",
        "microredca@gmail.com",
        "Urbanización La Isabelica, Calle Carabobo, Casa 12, Valencia, Carabobo"
    ),
    (
        "PC SHOP",
        "Ana Torres",
        "0412-7274671",
        "ventas@pcshopvzla.com",
        "C.C. Siglo XXI, Local A54 PB Edo., Valencia, Carabobo"
    ),
    (
        "Datamastil",
        "Pedro González",
        "0241-8716724",
        "Datamastil@gmail.com",
        "6 Avenida Norte Sur 70, San Diego 2006, Carabobo"
    ),
    (
        "Compumastil",
        "Javier Blanco",
        "0241-8245250",
        "compumastil@gmail.com",
        "Local 10, Galeria Los Sauces Shopping Center, Av, Bolivar Norte, Edo Carabobo 2001, Carabobo"
    ),
    (
        "PC Express",
        "Isabel Mendoza",
        "0424-4641705",
        "pcexpressvzla@gmail.com",
        "Av. Bolívar Norte, C.C. Multicentro El Viñedo, Nivel D, Local D1-50 (al Lado del Elevado El Viñedo), El Viñedo, Valencia"
    );

-- Seed productos
INSERT INTO
    `productos` (
        `id`,
        `categoriaId`,
        `marca`,
        `modelo`,
        `descripcion`
    )
VALUES
    (1, 1, "Cisco", "ISR4000", "Router PME."),
    (2, 2, "TP-Link", "TL-SG108", "Switch 8p Gigabit."),
    (3, 3, "Dell", "PowerEdge R740", "Servidor."),
    (
        4,
        4,
        "Intel",
        "Core i7-13700K",
        "Procesador 12 núcleos."
    ),
    (
        5,
        5,
        "Cat5e",
        "Cable UTP",
        "Cable Ethernet 1000 Mbps."
    ),
    (
        6,
        1,
        "D-Link",
        "DIR-850L",
        "Router inalámbrico AC."
    ),
    (
        7,
        2,
        "Netgear",
        "GS308T",
        "Switch Gigabit de 24 puertos."
    ),
    (
        8,
        3,
        "HPE",
        "ProLiant DL380 Gen10 Plus",
        "Servidor rack."
    ),
    (
        9,
        4,
        "AMD",
        "Ryzen 9 7950X",
        "Procesador 16 núcleos."
    );