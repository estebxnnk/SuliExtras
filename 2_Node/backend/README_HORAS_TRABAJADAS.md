# 🕐 Sistema de Registro de Horas Trabajadas

## 📋 Descripción

Este módulo permite a los empleados registrar sus horas de entrada y salida, calculando automáticamente las horas extra según la normativa laboral. El sistema incluye:

- ✅ Registro de horas trabajadas por empleados
- ✅ Cálculo automático de horas extra (más de 8 horas)
- ✅ Detección de horas nocturnas (22:00 - 6:00)
- ✅ Flujo de aprobación por supervisores
- ✅ Estadísticas y reportes
- ✅ Autenticación y autorización por roles

## 🏗️ Arquitectura

### Modelos
- **HorasTrabajadas**: Almacena los registros de horas trabajadas
- **User**: Usuarios del sistema
- **Roles**: Roles de usuario (Empleado, JefeDirecto, Administrador, etc.)

### Lógica de Negocio
- **HorasTrabajadasLogic**: Contiene toda la lógica de cálculo y validaciones
- **Cálculo de horas extra**: Jornada normal de 8 horas
- **Detección de horas nocturnas**: Entre 22:00 y 6:00

### Controladores
- **horasTrabajadasController**: Maneja las peticiones HTTP

### Middleware
- **authMiddleware**: Verificación de JWT
- **roleMiddleware**: Verificación de roles específicos

## 🚀 Instalación y Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Crear archivo `.env` con:
```env
DB_NAME=tu_base_de_datos
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=tu_secreto_jwt
```

### 3. Ejecutar scripts de inicialización
```bash
# Crear roles predeterminados
node scripts/crearRolesPredeterminados.js

# Poblar usuarios de prueba
node scripts/poblarUsuariosYRegistros.js

# Poblar horas trabajadas de prueba
node scripts/poblarHorasTrabajadas.js
```

### 4. Iniciar el servidor
```bash
npm start
```

## 📚 API Endpoints

### 🔐 Autenticación
Todos los endpoints requieren autenticación JWT en el header:
```
Authorization: Bearer <token>
```

### 📝 Registrar Horas Trabajadas
**POST** `/api/horas-trabajadas/registro`
- **Rol requerido**: Empleado
- **Body**:
```json
{
  "fecha": "2024-01-15",
  "horaEntrada": "08:00",
  "horaSalida": "18:00",
  "observaciones": "Trabajo extra por proyecto urgente"
}
```

### 📊 Listar Registros
**GET** `/api/horas-trabajadas`
- **Rol requerido**: Supervisor (JefeDirecto, Administrador, SuperAdministrador)
- **Respuesta**: Lista de todos los registros con información de usuarios

### 👤 Registros por Usuario
**GET** `/api/horas-trabajadas/usuario/{usuarioId}`
- **Rol requerido**: Supervisor
- **Respuesta**: Registros de un usuario específico

### ✅ Aprobar/Rechazar Registro
**PUT** `/api/horas-trabajadas/{registroId}/estado`
- **Rol requerido**: Supervisor
- **Body**:
```json
{
  "estado": "aprobado",
  "observaciones": "Aprobado por cumplir criterios"
}
```

### 📈 Estadísticas
**GET** `/api/horas-trabajadas/usuario/{usuarioId}/estadisticas?fechaInicio=2024-01-01&fechaFin=2024-01-31`
- **Rol requerido**: Supervisor
- **Respuesta**: Estadísticas del período

### 🧮 Calcular Horas Extra (Pruebas)
**POST** `/api/horas-trabajadas/calcular`
- **Sin autenticación** (para pruebas)
- **Body**:
```json
{
  "horaEntrada": "08:00",
  "horaSalida": "18:00"
}
```

## 🔧 Cálculo de Horas Extra

### Jornada Normal
- **8 horas** por día
- Cualquier hora adicional se considera **hora extra**

### Tipos de Hora Extra
1. **Normal**: Horas extra en horario diurno (6:00 - 22:00)
2. **Nocturna**: Horas extra en horario nocturno (22:00 - 6:00)
3. **Ninguna**: No hay horas extra

### Ejemplos de Cálculo

| Entrada | Salida | Horas Trabajadas | Horas Extra | Tipo |
|---------|--------|------------------|-------------|------|
| 08:00   | 17:00  | 9.0              | 1.0         | Normal |
| 08:00   | 18:00  | 10.0             | 2.0         | Normal |
| 22:00   | 06:00  | 8.0              | 0.0         | Ninguna |
| 20:00   | 02:00  | 6.0              | 0.0         | Ninguna |
| 22:00   | 08:00  | 10.0             | 2.0         | Nocturna |

## 🔐 Roles y Permisos

### Empleado
- ✅ Registrar sus propias horas trabajadas
- ❌ Ver registros de otros usuarios
- ❌ Aprobar/rechazar registros

### JefeDirecto
- ✅ Ver todos los registros
- ✅ Aprobar/rechazar registros
- ✅ Ver estadísticas

### Administrador
- ✅ Todas las funciones de JefeDirecto
- ✅ Gestión completa del sistema

### SuperAdministrador
- ✅ Acceso total al sistema
- ✅ Configuración de roles y permisos

## 📊 Estados de Registro

1. **pendiente**: Registro creado, esperando aprobación
2. **aprobado**: Registro aprobado por supervisor
3. **rechazado**: Registro rechazado por supervisor

## 🧪 Pruebas

### 1. Crear un empleado
```bash
# Usar el endpoint de registro de usuarios
POST /api/auth/register
```

### 2. Iniciar sesión como empleado
```bash
POST /api/auth/login
{
  "email": "empleado@empresa.com",
  "password": "123456"
}
```

### 3. Registrar horas trabajadas
```bash
POST /api/horas-trabajadas/registro
Authorization: Bearer <token>
{
  "fecha": "2024-01-15",
  "horaEntrada": "08:00",
  "horaSalida": "18:00",
  "observaciones": "Trabajo extra"
}
```

### 4. Aprobar como supervisor
```bash
PUT /api/horas-trabajadas/1/estado
Authorization: Bearer <token_supervisor>
{
  "estado": "aprobado",
  "observaciones": "Aprobado"
}
```

## 📝 Notas Importantes

1. **Un registro por día**: No se puede registrar más de un registro por usuario por día
2. **Solo empleados**: Solo usuarios con rol "Empleado" pueden registrar horas
3. **Validación de horarios**: Las horas deben estar en formato HH:mm
4. **Cálculo automático**: Las horas extra se calculan automáticamente
5. **Flujo de aprobación**: Los registros requieren aprobación de un supervisor

## 🐛 Solución de Problemas

### Error: "Usuario no encontrado"
- Verificar que el usuario existe en la base de datos
- Verificar que el token JWT es válido

### Error: "Ya existe un registro para esta fecha"
- Solo se permite un registro por día por usuario
- Verificar registros existentes

### Error: "Solo los empleados pueden registrar horas trabajadas"
- Verificar que el usuario tiene rol "Empleado"
- Verificar permisos en el middleware

### Error: "Formato de hora inválido"
- Usar formato HH:mm (ejemplo: 08:30, 18:45)
- No usar formato 24 horas con AM/PM

## 📞 Soporte

Para problemas o consultas sobre la implementación, revisar:
1. Logs del servidor
2. Documentación de Swagger en `/api-docs`
3. Validaciones en el código
4. Estado de la base de datos 