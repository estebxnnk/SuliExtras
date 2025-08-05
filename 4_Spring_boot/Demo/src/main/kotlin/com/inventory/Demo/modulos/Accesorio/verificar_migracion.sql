-- Script para verificar la migración de accesorios
-- Ejecutar después de la migración para confirmar que todo está correcto

-- 1. Verificar estructura de la tabla accesorios
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'accesorios' 
ORDER BY ordinal_position;

-- 2. Verificar que los accesorios tienen dispositivo_id
SELECT 
    COUNT(*) as total_accesorios,
    COUNT(dispositivo_id) as accesorios_con_dispositivo_id,
    COUNT(*) - COUNT(dispositivo_id) as accesorios_sin_dispositivo_id
FROM accesorios;

-- 3. Verificar la relación con dispositivos
SELECT 
    a.dispositivo_id,
    d.item,
    d.serial,
    a.tipo_accesorio,
    a.es_combo,
    d.estado,
    d.tipo_dispositivo
FROM accesorios a
JOIN dispositivos d ON a.dispositivo_id = d.dispositivo_id
LIMIT 10;

-- 4. Verificar que no hay columnas duplicadas
SELECT 
    'accesorios' as tabla,
    COUNT(*) as total_columnas
FROM information_schema.columns 
WHERE table_name = 'accesorios'
UNION ALL
SELECT 
    'dispositivos' as tabla,
    COUNT(*) as total_columnas
FROM information_schema.columns 
WHERE table_name = 'dispositivos';

-- 5. Verificar foreign key
SELECT 
    constraint_name,
    table_name,
    column_name,
    referenced_table_name,
    referenced_column_name
FROM information_schema.key_column_usage 
WHERE table_name = 'accesorios' 
AND referenced_table_name IS NOT NULL;

-- 6. Verificar datos de ejemplo
SELECT 
    'Accesorios simples' as tipo,
    COUNT(*) as cantidad
FROM accesorios 
WHERE es_combo = false
UNION ALL
SELECT 
    'Combos' as tipo,
    COUNT(*) as cantidad
FROM accesorios 
WHERE es_combo = true;

-- 7. Verificar estados
SELECT 
    d.estado,
    COUNT(*) as cantidad
FROM accesorios a
JOIN dispositivos d ON a.dispositivo_id = d.dispositivo_id
GROUP BY d.estado; 