-- DROP DATABASE IF EXISTS `stockbrain`;
CREATE DATABASE IF NOT EXISTS `stockbrain`;

-- Referencia de tamaño
--  32 caracteres 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
--  64 caracteres 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
-- 128 caracteres 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
USE `stockbrain`;

SET
    foreign_key_checks = 0;

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

DROP TABLE IF EXISTS `usuarios`;

CREATE TABLE
    `usuarios` (
        `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
        `nombre` VARCHAR(64),
        `email` VARCHAR(128),
        `password` VARCHAR(128),
        `rol` INT
    );

DROP TABLE IF EXISTS `clientes`;

CREATE TABLE
    `clientes` (
        `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
        `nombre` VARCHAR(64),
        `responsable` VARCHAR(64),
        `ubicacion` VARCHAR(64)
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
        -- `almacenId` BIGINT,
        `productoId` BIGINT,
        `identificador` VARCHAR(128),
        `estado` TINYINT,
        `cantidad` BIGINT,
        UNIQUE (`productoId`, `estado`),
        FOREIGN KEY (`productoId`) REFERENCES `productos` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT
    );

DROP TABLE IF EXISTS `almacenes`;

CREATE TABLE
    `almacenes` (
        `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
        `nombre` VARCHAR(64),
        `ubicacion` VARCHAR(64)
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
        -- `almacenId` BIGINT,
        `productoId` BIGINT,
        `cantidad` INT,
        `precioUnitario` DECIMAL(10, 2),
        `total` DECIMAL(10, 2),
        FOREIGN KEY (`ordenId`) REFERENCES `ordenesCompra` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
        -- FOREIGN KEY (`almacenId`) REFERENCES `almacenes` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
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
        -- `almacenId` BIGINT,
        `productoId` BIGINT,
        `cantidad` INT,
        FOREIGN KEY (`ordenId`) REFERENCES `ordenesCompra` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
        -- FOREIGN KEY (`almacenId`) REFERENCES `almacenes` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
        FOREIGN KEY (`productoId`) REFERENCES `productos` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT
    );

DROP TABLE IF EXISTS `ajustesInventario`;

CREATE TABLE
    `ajustesInventario` (
        `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
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

DROP TABLE IF EXISTS `movimientosInventario`;

CREATE TABLE
    `movimientosInventario` (
        `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
        `fecha` TIMESTAMP,
        `operadorId` BIGINT,
        `productoId` BIGINT,
        -- `almacenOrigenId` BIGINT NULL,
        -- `almacenDestinoId` BIGINT,
        `estadoOrigen` BIGINT NULL,
        `estadoDestino` BIGINT,
        `tipo` INT,
        `ordenCompraId` BIGINT NULL,
        `ordenConsumoId` BIGINT NULL,
        `ajusteId` BIGINT NULL,
        `cantidad` INT,
        `fueEditada` TINYINT DEFAULT FALSE,
        FOREIGN KEY (`operadorId`) REFERENCES `usuarios` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
        -- FOREIGN KEY (`almacenOrigenId`) REFERENCES `almacenes` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
        -- FOREIGN KEY (`almacenDestinoId`) REFERENCES `almacenes` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
        FOREIGN KEY (`ordenCompraId`) REFERENCES `ordenesCompra` (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (`ordenConsumoId`) REFERENCES `ordenConsumoId` (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (`ajusteId`) REFERENCES `ajustesInventario` (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (`productoId`) REFERENCES `productos` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
    );

SET
    foreign_key_checks = 1;
