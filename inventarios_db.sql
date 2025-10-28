
-- =========================================================
--  Inventarios DB - Script completo (MySQL Workbench ready)
--  Crea BD, tablas (>=5), datos de ejemplo, SP transaccional
--  y consultas (JOIN, SUBQUERY, GROUP BY) para el TP.
-- =========================================================

-- 1) Crear Base de Datos y usarla
DROP DATABASE IF EXISTS inventarios_db;
CREATE DATABASE inventarios_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE inventarios_db;

-- 2) (Opcional) Crear usuario local para el proyecto
-- CREATE USER 'inventario_user'@'localhost' IDENTIFIED BY '12345';
-- GRANT ALL PRIVILEGES ON inventarios_db.* TO 'inventario_user'@'localhost';
-- FLUSH PRIVILEGES;

-- =========================================================
-- 3) Tablas
-- =========================================================

-- Usuarios (para JWT)
DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('admin','empleado') DEFAULT 'empleado',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categorías
DROP TABLE IF EXISTS categorias;
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255)
);

-- Proveedores
DROP TABLE IF EXISTS proveedores;
CREATE TABLE proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(30),
    email VARCHAR(100),
    direccion VARCHAR(255)
);

-- Productos
DROP TABLE IF EXISTS productos;
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    stock_actual INT DEFAULT 0,
    stock_minimo INT DEFAULT 0,
    precio_compra DECIMAL(10,2),
    precio_venta DECIMAL(10,2),
    id_categoria INT,
    id_proveedor INT,
    CONSTRAINT fk_prod_cat FOREIGN KEY (id_categoria) REFERENCES categorias(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_prod_prov FOREIGN KEY (id_proveedor) REFERENCES proveedores(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_prod_nombre (nombre),
    INDEX idx_prod_categoria (id_categoria),
    INDEX idx_prod_proveedor (id_proveedor)
);

-- Movimientos de stock
DROP TABLE IF EXISTS movimientos_stock;
CREATE TABLE movimientos_stock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL,
    tipo ENUM('entrada','salida') NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_usuario INT,
    CONSTRAINT fk_mov_prod FOREIGN KEY (id_producto) REFERENCES productos(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_mov_user FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_mov_fecha (fecha),
    INDEX idx_mov_producto (id_producto)
);

-- =========================================================
-- 4) Datos de ejemplo (mínimos para probar)
-- =========================================================

INSERT INTO categorias (nombre, descripcion) VALUES
('Camisetas', 'Indumentaria deportiva superior'),
('Shorts', 'Prendas inferiores deportivas');

INSERT INTO proveedores (nombre, telefono, email, direccion) VALUES
('Deportes La Rioja', '380-4567890', 'contacto@deporteslr.com', 'Av. San Nicolás 123'),
('Fútbol Store', '380-1234567', 'ventas@futbolstore.com', 'Bv. Belgrano 456');

INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES
('Admin', 'admin@inventarios.com', '$2b$12$hashDeEjemploNoValido', 'admin'),
('Empleado', 'empleado@inventarios.com', '$2b$12$hashDeEjemploNoValido', 'empleado');

INSERT INTO productos (nombre, descripcion, stock_actual, stock_minimo, precio_compra, precio_venta, id_categoria, id_proveedor)
VALUES
('Camiseta Boca 2025', 'Modelo titular 2025', 10, 3, 18000, 25000, 1, 1),
('Camiseta River 2025', 'Modelo titular 2025', 12, 4, 18000, 25000, 1, 2),
('Short Entrenamiento', 'Short liviano 2025', 6, 2, 9000, 15000, 2, 2);

-- =========================================================
-- 5) Procedimiento almacenado (transaccional)
--    Requisito: COMMIT/ROLLBACK con validaciones
-- =========================================================

DROP PROCEDURE IF EXISTS registrar_movimiento;
DELIMITER //

CREATE PROCEDURE registrar_movimiento (
    IN p_id_producto INT,
    IN p_tipo ENUM('entrada','salida'),
    IN p_cantidad INT,
    IN p_id_usuario INT
)
BEGIN
    DECLARE v_stock_actual INT;

    -- Iniciar transacción
    START TRANSACTION;

    -- Bloquear fila del producto para lectura/actualización segura
    SELECT stock_actual INTO v_stock_actual
    FROM productos
    WHERE id = p_id_producto
    FOR UPDATE;

    IF v_stock_actual IS NULL THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Producto no encontrado';
    END IF;

    IF p_tipo = 'salida' AND v_stock_actual < p_cantidad THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Stock insuficiente para salida';
    ELSE
        -- Registrar movimiento
        INSERT INTO movimientos_stock (id_producto, tipo, cantidad, id_usuario)
        VALUES (p_id_producto, p_tipo, p_cantidad, p_id_usuario);

        -- Actualizar stock
        IF p_tipo = 'entrada' THEN
            UPDATE productos SET stock_actual = stock_actual + p_cantidad WHERE id = p_id_producto;
        ELSE
            UPDATE productos SET stock_actual = stock_actual - p_cantidad WHERE id = p_id_producto;
        END IF;

        COMMIT;
    END IF;
END //

DELIMITER ;

-- =========================================================
-- 6) Pruebas rápidas del SP
-- =========================================================

-- Entrada de stock +5 a producto 1 por el usuario 1
CALL registrar_movimiento(1, 'entrada', 5, 1);

-- Salida de stock -3 a producto 2 por el usuario 1
CALL registrar_movimiento(2, 'salida', 3, 1);

-- Salida con stock insuficiente (debería fallar y hacer ROLLBACK)
-- CALL registrar_movimiento(3, 'salida', 999, 1);

-- =========================================================
-- 7) Consultas SQL exigidas por el TP (ejemplos)
--    JOIN, SUBQUERY, GROUP BY
-- =========================================================

-- 7.1) INNER JOIN: listado de productos con su categoría y proveedor
SELECT p.id, p.nombre AS producto, c.nombre AS categoria, pr.nombre AS proveedor, p.stock_actual, p.precio_venta
FROM productos p
INNER JOIN categorias c ON p.id_categoria = c.id
INNER JOIN proveedores pr ON p.id_proveedor = pr.id
ORDER BY p.id;

-- 7.2) SUBQUERY: productos por debajo del stock mínimo definido
SELECT *
FROM productos
WHERE stock_actual < stock_minimo;

-- Variante con subconsulta: productos con stock menor al promedio general
SELECT id, nombre, stock_actual
FROM productos
WHERE stock_actual < (SELECT AVG(stock_actual) FROM productos);

-- 7.3) GROUP BY: resumen mensual de movimientos (neto de entradas - salidas)
SELECT DATE_FORMAT(fecha, '%Y-%m') AS mes,
       SUM(CASE WHEN tipo = 'entrada' THEN cantidad ELSE -cantidad END) AS saldo_neto
FROM movimientos_stock
GROUP BY mes
ORDER BY mes;

-- 7.4) GROUP BY + JOIN: stock total por categoría
SELECT c.nombre AS categoria,
       SUM(p.stock_actual) AS stock_total_categoria,
       COUNT(p.id) AS cantidad_productos
FROM categorias c
INNER JOIN productos p ON p.id_categoria = c.id
GROUP BY c.id, c.nombre
ORDER BY stock_total_categoria DESC;

-- =========================================================
-- 8) Vistas (opcional, útil para reportes)
-- =========================================================
DROP VIEW IF EXISTS vw_productos_detalle;
CREATE VIEW vw_productos_detalle AS
SELECT p.id,
       p.nombre AS producto,
       c.nombre AS categoria,
       pr.nombre AS proveedor,
       p.stock_actual,
       p.stock_minimo,
       p.precio_compra,
       p.precio_venta
FROM productos p
LEFT JOIN categorias c ON p.id_categoria = c.id
LEFT JOIN proveedores pr ON p.id_proveedor = pr.id;

-- Ejemplo de uso:
-- SELECT * FROM vw_productos_detalle ORDER BY producto;
