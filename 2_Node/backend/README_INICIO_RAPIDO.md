# 🚀 Inicio Rápido - SuliExtras Backend

## ✅ Estado del Proyecto

**¡El proyecto está funcionando correctamente!** 

- ✅ Conexión a base de datos exitosa
- ✅ Todas las tablas sincronizadas
- ✅ Servidor corriendo en http://localhost:3000
- ✅ API REST ejecutándose correctamente

## 🎯 Inicio Rápido

### Opción 1: Script de Windows
```bash
# Doble clic en el archivo
start.bat
```

### Opción 2: Comando directo
```bash
# Navegar al directorio
cd C:\RepositorioEsteban\SuliExtras\2_Node\backend

# Instalar dependencias (si no están instaladas)
npm install

# Iniciar el servidor
node index.js
```

### Opción 3: Con nodemon (desarrollo)
```bash
# Instalar nodemon globalmente (si no está instalado)
npm install -g nodemon

# Iniciar con nodemon
nodemon index.js
```

## 📊 Endpoints Disponibles

### 🔐 Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

### 🏢 Sedes
- `GET /api/sedes` - Listar sedes
- `POST /api/sedes` - Crear sede
- `GET /api/sedes/{id}` - Obtener sede específica
- `PUT /api/sedes/{id}` - Actualizar sede
- `DELETE /api/sedes/{id}` - Eliminar sede

### 🕐 Horarios de Sede
- `GET /api/horarios-sede/sede/{id}` - Horarios de una sede
- `POST /api/horarios-sede` - Crear horario
- `GET /api/horarios-sede/sede/{id}/semanal` - Horario semanal

### 👥 Usuarios
- `GET /api/usuarios` - Listar usuarios
- `POST /api/usuarios` - Crear usuario
- `PUT /api/usuarios/{id}` - Actualizar usuario

### 🕐 Horas Trabajadas
- `POST /api/horas-trabajadas/registro` - Registrar horas
- `GET /api/horas-trabajadas` - Listar registros
- `GET /api/horas-trabajadas/usuario/{id}` - Registros por usuario

## 📚 Documentación

### Swagger UI
```
http://localhost:3000/api-docs
```

### Endpoints Principales
1. **Autenticación**: `/api/auth/*`
2. **Sedes**: `/api/sedes/*`
3. **Horarios**: `/api/horarios-sede/*`
4. **Usuarios**: `/api/usuarios/*`
5. **Horas Trabajadas**: `/api/horas-trabajadas/*`

## 🔧 Configuración

### Variables de Entorno (.env)
```env
DB_NAME=tu_base_de_datos
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=tu_secreto_jwt
PORT=3000
```

### Base de Datos
- **Tipo**: PostgreSQL
- **Puerto**: 5432 (por defecto)
- **Sincronización**: Automática con `alter: true`

## 🎯 Próximos Pasos

### 1. Poblar Datos de Prueba
```bash
# Crear roles predeterminados
node scripts/crearRolesPredeterminados.js

# Poblar usuarios de prueba
node scripts/poblarUsuariosYRegistros.js

# Crear sedes y horarios
node scripts/poblarSedesYHorarios.js

# Asignar empleados a sedes
node scripts/asignarEmpleadosASedes.js
```

### 2. Probar la API
```bash
# Usar Postman o similar
# URL base: http://localhost:3000

# Ejemplo: Obtener todas las sedes
GET http://localhost:3000/api/sedes
Authorization: Bearer <token>
```

### 3. Verificar Funcionalidad
- ✅ Crear una sede
- ✅ Configurar horarios
- ✅ Asignar empleados
- ✅ Registrar horas trabajadas
- ✅ Calcular horas extra automáticamente

## 🐛 Solución de Problemas

### Error: "Conexión a la base de datos fallida"
- Verificar que PostgreSQL esté corriendo
- Verificar credenciales en `.env`
- Verificar que la base de datos exista

### Error: "Puerto 3000 en uso"
- Cambiar puerto en `.env`
- O matar el proceso que usa el puerto

### Error: "Módulo no encontrado"
- Ejecutar `npm install`
- Verificar que todas las dependencias estén instaladas

## 📞 Soporte

Para problemas o consultas:
1. Revisar logs del servidor
2. Verificar documentación Swagger
3. Revisar archivos de configuración
4. Verificar estado de la base de datos

## 🎉 ¡Listo!

El proyecto está funcionando correctamente y listo para usar. 

**URL del servidor**: http://localhost:3000
**Documentación**: http://localhost:3000/api-docs 