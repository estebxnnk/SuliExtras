# 🚀 Guía para Ejecutar la Migración de Accesorios

## 📋 **Pasos Previos (IMPORTANTE)**

### 1. **Hacer Backup de la Base de Datos**
```bash
# PostgreSQL
pg_dump -U tu_usuario -d tu_base_de_datos > backup_antes_migracion_$(date +%Y%m%d_%H%M%S).sql

# MySQL
mysqldump -u tu_usuario -p tu_base_de_datos > backup_antes_migracion_$(date +%Y%m%d_%H%M%S).sql
```

### 2. **Verificar Configuración de Base de Datos**
Editar `src/main/resources/application.properties` con tus credenciales:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/tu_base_de_datos
spring.datasource.username=tu_usuario
spring.datasource.password=tu_password
```

## 🔧 **Opciones de Ejecución**

### **Opción 1: Usando Spring Boot (Recomendado)**

1. **Ejecutar la aplicación:**
```bash
./gradlew bootRun
```

2. **Flyway ejecutará automáticamente la migración al iniciar**

### **Opción 2: Ejecutar Migración Manualmente**

1. **Usando Flyway CLI:**
```bash
# Instalar Flyway CLI
# Descargar desde: https://flywaydb.org/download

# Ejecutar migración
flyway -url=jdbc:postgresql://localhost:5432/tu_base_de_datos \
       -user=tu_usuario \
       -password=tu_password \
       -locations=filesystem:src/main/resources/db/migration \
       migrate
```

### **Opción 3: Ejecutar SQL Directamente**

#### **Para PostgreSQL:**
```bash
psql -U tu_usuario -d tu_base_de_datos -f src/main/kotlin/com/inventory/Demo/modulos/Accesorio/migration.sql
```

#### **Para MySQL:**
```bash
mysql -u tu_usuario -p tu_base_de_datos < src/main/kotlin/com/inventory/Demo/modulos/Accesorio/migration.sql
```

## ✅ **Verificar la Migración**

### 1. **Ejecutar script de verificación:**
```bash
# PostgreSQL
psql -U tu_usuario -d tu_base_de_datos -f src/main/kotlin/com/inventory/Demo/modulos/Accesorio/verificar_migracion.sql

# MySQL
mysql -u tu_usuario -p tu_base_de_datos < src/main/kotlin/com/inventory/Demo/modulos/Accesorio/verificar_migracion.sql
```

### 2. **Verificar desde la aplicación:**
```bash
# Probar la API
curl -X GET http://localhost:8080/api/accesorios
```

## 🚨 **En Caso de Problemas**

### **Rollback Manual:**
```sql
-- Restaurar desde backup
DROP TABLE IF EXISTS accesorios;
CREATE TABLE accesorios AS SELECT * FROM accesorios_backup_YYYYMMDD_HHMMSS;
```

### **Verificar Logs:**
```bash
# Ver logs de Spring Boot
tail -f logs/application.log

# Ver logs de Flyway
grep -i flyway logs/application.log
```

## 📊 **Verificaciones Post-Migración**

### 1. **Estructura de Tablas:**
- ✅ Tabla `accesorios` tiene `dispositivo_id`
- ✅ Tabla `accesorios` tiene `tipo_accesorio`
- ✅ Foreign key a `dispositivos` existe
- ✅ No hay columnas duplicadas

### 2. **Datos:**
- ✅ Todos los accesorios tienen `dispositivo_id`
- ✅ Los datos se migraron correctamente
- ✅ Los estados se convirtieron correctamente

### 3. **API:**
- ✅ Endpoints funcionan correctamente
- ✅ DTOs se serializan correctamente
- ✅ Búsquedas funcionan

## 🔍 **Comandos de Diagnóstico**

```bash
# Verificar estado de Flyway
flyway -url=jdbc:postgresql://localhost:5432/tu_base_de_datos \
       -user=tu_usuario \
       -password=tu_password \
       info

# Verificar estructura de tablas
psql -U tu_usuario -d tu_base_de_datos -c "\d accesorios"
psql -U tu_usuario -d tu_base_de_datos -c "\d dispositivos"

# Verificar datos
psql -U tu_usuario -d tu_base_de_datos -c "SELECT COUNT(*) FROM accesorios;"
psql -U tu_usuario -d tu_base_de_datos -c "SELECT COUNT(*) FROM dispositivos WHERE tipo_dispositivo = 'ACCESORIO';"
```

## 📞 **Soporte**

Si encuentras problemas:
1. Revisar logs de la aplicación
2. Verificar configuración de base de datos
3. Ejecutar script de verificación
4. Restaurar desde backup si es necesario 