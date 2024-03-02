CREATE DATABASE IF NOT EXISTS `stockbrain`;

-- Referencia de tamaño
--  32 caracteres 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
--  64 caracteres 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
-- 128 caracteres 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
USE `stockbrain`;

DROP IF EXISTS `categorias`;

CREATE TABLE
    `categorias` (
        `id` BIGINT PRIMARY KEY,
        `nombre` VARCHAR(64),
        `descripcion` VARCHAR(128)
    );

DROP IF EXISTS `proveedores`;

CREATE TABLE
    `proveedores` (
        `id` BIGINT PRIMARY KEY,
        `nombre` VARCHAR(64),
        `contacto` VARCHAR(64),
        `telefono` VARCHAR(32),
        `email` VARCHAR(128),
        `direccion` VARCHAR(128)
    );

-- DROP IF EXISTS `almacenes`;

-- CREATE TABLE
--     `almacenes` (
--         `id` BIGINT PRIMARY KEY,
--         `nombre` VARCHAR(64),
--         `ubicacion` VARCHAR(64)
--     );

DROP IF EXISTS `usuarios`;

CREATE TABLE
    `usuarios` (
        `id` BIGINT PRIMARY KEY,
        `nombre` VARCHAR(64),
        `email` VARCHAR(128),
        `password` VARCHAR(128),
        `rol` INT
    );

DROP IF EXISTS `clientes`;

CREATE TABLE
    `clientes` (
        `id` BIGINT PRIMARY KEY,
        `nombre` VARCHAR(64),
        `responsable` VARCHAR(64),
        `ubicacion` VARCHAR(64)
    );

DROP IF EXISTS `productos`;

CREATE TABLE
    `productos` (
        `id` BIGINT PRIMARY KEY,
        `categoriaId` BIGINT,
        -- `proveedorId` BIGINT,
        `marca` VARCHAR(128),
        `modelo` VARCHAR(128),
        `descripcion` VARCHAR(128),
        -- `precio` VARCHAR(128),
        `imagen` VARCHAR(128) NULL,
        FOREIGN KEY (`categoriaId`) REFERENCES `categorias` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT
        -- FOREIGN KEY (`proveedorId`) REFERENCES `proveedores` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT
    );

CREATE TABLE
    `productoStocks` (
        `id` BIGINT PRIMARY KEY,
        `productoId` BIGINT,
        `identificador` VARCHAR(128),
        `estado` TINYINT,
        `cantidad` BIGINT,
        FOREIGN KEY (`productoId`) REFERENCES `productos` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT
    );

-- DROP IF EXISTS `almacenes`;

-- CREATE TABLE
--     `almacenes` (
--         `id` BIGINT PRIMARY KEY,
--         `nombre` VARCHAR(64),
--         `ubicacion` VARCHAR(64)
--     );

DROP IF EXISTS `ordenesCompra`;

CREATE TABLE
    `ordenesCompra` (
        `id` BIGINT PRIMARY KEY,
        `proveedorId` BIGINT,
        `fecha` TIMESTAMP,
        `operadorId` BIGINT,
        FOREIGN KEY (`operadorId`) REFERENCES `usuarios` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
        FOREIGN KEY (`proveedorId`) REFERENCES `proveedores` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT
    );

DROP IF EXISTS `ordenesCompraItems`;

CREATE TABLE
    `ordenesCompraItems` (
        `id` BIGINT PRIMARY KEY,
        `ordenId` BIGINT,
        -- `almacenId` BIGINT,
        `productoId` BIGINT,
        `cantidad` INT,
        `precioUnitario` DECIMAL(10, 2),
        `total` DECIMAL(10, 2),
        FOREIGN KEY (`ordenId`) REFERENCES `ordenesCompra` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
        -- FOREIGN KEY (`almacenId`) REFERENCES `almacenes` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
        FOREIGN KEY (`productoId`) REFERENCES `productos` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT
    );

DROP IF EXISTS `ordenesConsumo`;

CREATE TABLE
    `ordenesConsumo` (
        `id` BIGINT PRIMARY KEY,
        -- `clienteId` BIGINT,
        `descripcion` VARCHAR(128),
        `fecha` TIMESTAMP,
        `operadorId` BIGINT,
        -- FOREIGN KEY (`clienteId`) REFERENCES `clientes` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT
        FOREIGN KEY (`operadorId`) REFERENCES `usuarios` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT
    );

DROP IF EXISTS `ordenesConsumoItems`;

CREATE TABLE
    `ordenesConsumoItems` (
        `id` BIGINT PRIMARY KEY,
        `ordenId` BIGINT,
        -- `almacenId` BIGINT,
        `productoId` BIGINT,
        `cantidad` INT,
        -- `precioUnitario` DECIMAL(10, 2),
        -- `total` DECIMAL(10, 2),
        FOREIGN KEY (`ordenId`) REFERENCES `ordenesCompra` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
        -- FOREIGN KEY (`almacenId`) REFERENCES `almacenes` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
        FOREIGN KEY (`productoId`) REFERENCES `productos` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT
    );

DROP IF EXISTS `ajustesInventario`;

CREATE TABLE
    `ajustesInventario` (
        `id` BIGINT PRIMARY KEY,
        `operadorId` BIGINT,
        `fecha` TIMESTAMP,
        -- `almacenId` BIGINT,
        `productoId` BIGINT,
        `estado` TINYINT,
        `tipo` INT,
        `cantidad` INT,
        `motivo` VARCHAR(128),
        FOREIGN KEY (`operadorId`) REFERENCES `usuarios` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
        -- FOREIGN KEY (`almacenId`) REFERENCES `almacenes` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
        FOREIGN KEY (`productoId`) REFERENCES `productos` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT
    );

DROP IF EXISTS `movimientosInventario`;

CREATE TABLE
    `movimientosInventario` (
        `id` BIGINT PRIMARY KEY,
        `fecha` TIMESTAMP,
        `operadorId` BIGINT,
        `productoId` BIGINT,
        `estadoOrigen` BIGINT NULL,
        `estadoDestino` BIGINT,
        `tipo` INT,
        -- Se refiere al ID de la orden de compra, consumo o ajuste
        `relacionId` BIGINT NULL,
        `cantidad` INT,
        FOREIGN KEY (`operadorId`) REFERENCES `usuarios` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
        FOREIGN KEY (`productoId`) REFERENCES `productos` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT
    );