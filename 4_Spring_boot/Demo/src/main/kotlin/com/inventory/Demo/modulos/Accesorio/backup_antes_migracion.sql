-- Script de backup antes de la migración de accesorios
-- EJECUTAR ANTES DE LA MIGRACIÓN

-- 1. Crear backup de la tabla accesorios original
CREATE TABLE accesorios_backup_$(date +%Y%m%d_%H%M%S) AS 
SELECT * FROM accesorios;

-- 2. Crear backup de la tabla dispositivos
CREATE TABLE dispositivos_backup_$(date +%Y%m%d_%H%M%S) AS 
SELECT * FROM dispositivos;

-- 3. Verificar datos antes de la migración
SELECT 
    'accesorios' as tabla,
    COUNT(*) as total_registros
FROM accesorios
UNION ALL
SELECT 
    'dispositivos' as tabla,
    COUNT(*) as total_registros
FROM dispositivos;

-- 4. Verificar estructura actual
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'accesorios' 
ORDER BY ordinal_position;

-- 5. Verificar datos de ejemplo
SELECT 
    id,
    item,
    serial,
    tipo,
    estado,
    es_combo
FROM accesorios 
LIMIT 5; 