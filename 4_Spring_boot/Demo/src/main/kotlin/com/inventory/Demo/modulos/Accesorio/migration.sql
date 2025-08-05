-- Script de migración para refactorización del módulo Accesorio
-- Ejecutar después de hacer backup de la base de datos

-- 1. Crear tabla temporal para preservar datos existentes
CREATE TABLE accesorios_temp AS SELECT * FROM accesorios;

-- 2. Agregar columna tipo_dispositivo si no existe
ALTER TABLE accesorios ADD COLUMN IF NOT EXISTS tipo_dispositivo VARCHAR(20) DEFAULT 'ACCESORIO';

-- 3. Agregar columna dispositivo_id si no existe
ALTER TABLE accesorios ADD COLUMN IF NOT EXISTS dispositivo_id BIGINT;

-- 4. Crear secuencia para dispositivo_id si no existe
CREATE SEQUENCE IF NOT EXISTS dispositivos_seq;

-- 5. Insertar registros en la tabla dispositivos
INSERT INTO dispositivos (
    dispositivo_id, item, serial, modelo, marca, categoria_id, sede_id, 
    estado, clasificacion, fecha_adquisicion, costo, funcional, 
    codigo_activo, tipo, observaciones, tipo_dispositivo
)
SELECT 
    nextval('dispositivos_seq'), 
    item, 
    serial, 
    modelo, 
    marca, 
    categoria_id, 
    sede_id, 
    CASE 
        WHEN estado = 'Bueno' THEN 'DISPONIBLE'
        WHEN estado = 'Dañado' THEN 'MANTENIMIENTO'
        WHEN estado = 'Perdido' THEN 'BAJA'
        ELSE 'DISPONIBLE'
    END as estado,
    'Accesorio' as clasificacion,
    CURRENT_DATE as fecha_adquisicion,
    NULL as costo,
    true as funcional,
    NULL as codigo_activo,
    tipo as tipo,
    NULL as observaciones,
    'ACCESORIO' as tipo_dispositivo
FROM accesorios_temp;

-- 6. Actualizar dispositivo_id en tabla accesorios
UPDATE accesorios a 
SET dispositivo_id = d.dispositivo_id 
FROM dispositivos d 
WHERE d.tipo_dispositivo = 'ACCESORIO' 
AND d.serial = a.serial 
AND d.item = a.item;

-- 7. Eliminar columnas duplicadas de la tabla accesorios
ALTER TABLE accesorios DROP COLUMN IF EXISTS item;
ALTER TABLE accesorios DROP COLUMN IF EXISTS serial;
ALTER TABLE accesorios DROP COLUMN IF EXISTS modelo;
ALTER TABLE accesorios DROP COLUMN IF EXISTS marca;
ALTER TABLE accesorios DROP COLUMN IF EXISTS categoria_id;
ALTER TABLE accesorios DROP COLUMN IF EXISTS sede_id;
ALTER TABLE accesorios DROP COLUMN IF EXISTS estado;
ALTER TABLE accesorios DROP COLUMN IF EXISTS tipo;

-- 8. Renombrar columna tipo a tipo_accesorio
ALTER TABLE accesorios RENAME COLUMN tipo TO tipo_accesorio;

-- 9. Agregar foreign key a dispositivos
ALTER TABLE accesorios 
ADD CONSTRAINT fk_accesorio_dispositivo 
FOREIGN KEY (dispositivo_id) REFERENCES dispositivos(dispositivo_id);

-- 10. Eliminar tabla temporal
DROP TABLE accesorios_temp;

-- 11. Verificar migración
SELECT 
    a.dispositivo_id,
    d.item,
    d.serial,
    a.tipo_accesorio,
    a.es_combo,
    d.estado
FROM accesorios a
JOIN dispositivos d ON a.dispositivo_id = d.dispositivo_id
LIMIT 10; 