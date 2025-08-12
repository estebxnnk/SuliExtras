# 🏢 Sistema de Gestión de Sedes y Horarios

## 📋 Descripción

Este módulo extiende el sistema de registro de horas trabajadas con la gestión de **sedes** y sus **horarios específicos**. Cada sede puede tener múltiples horarios configurados por día de la semana, y los empleados se calculan según el horario de su sede asignada.

### 🆕 Nuevas Funcionalidades

- ✅ **Gestión de Sedes**: Crear, editar y administrar sedes de la empresa
- ✅ **Horarios por Sede**: Configurar horarios específicos para cada sede
- ✅ **Asignación de Empleados**: Asignar empleados a sedes específicas
- ✅ **Cálculo Inteligente**: Las horas extra se calculan según el horario de la sede
- ✅ **Tipos de Horario**: Normal, nocturno, especial y festivo
- ✅ **Tolerancias**: Configurar tolerancias de entrada y salida
- ✅ **Horarios por Defecto**: Crear horarios estándar automáticamente

## 🏗️ Arquitectura

### Modelos Nuevos
- **Sede**: Información de las sedes (nombre, dirección, ciudad, etc.)
- **HorarioSede**: Horarios específicos de cada sede por día
- **User**: Actualizado con campo `sedeId` para asignación

### Relaciones
```
Sede (1) ←→ (N) HorarioSede
Sede (1) ←→ (N) User
User (1) ←→ (N) HorasTrabajadas
```

## 🚀 Instalación y Configuración

### 1. Ejecutar scripts en orden
```bash
# 1. Crear roles predeterminados
node scripts/crearRolesPredeterminados.js

# 2. Poblar usuarios de prueba
node scripts/poblarUsuariosYRegistros.js

# 3. Crear sedes y horarios
node scripts/poblarSedesYHorarios.js

# 4. Asignar empleados a sedes
node scripts/asignarEmpleadosASedes.js

# 5. Poblar horas trabajadas (opcional)
node scripts/poblarHorasTrabajadas.js
```

### 2. Iniciar el servidor
```bash
npm start
```

## 📚 API Endpoints - Sedes

### 🔐 Autenticación
Todos los endpoints requieren autenticación JWT:
```
Authorization: Bearer <token>
```

### 🏢 Gestión de Sedes

#### Crear Sede
**POST** `/api/sedes`
- **Rol requerido**: Administrador
- **Body**:
```json
{
  "nombre": "Sede Principal",
  "direccion": "Calle 123 #45-67",
  "ciudad": "Bogotá",
  "telefono": "3001234567",
  "email": "sede@empresa.com",
  "descripcion": "Sede principal de la empresa"
}
```

#### Listar Sedes
**GET** `/api/sedes`
- **Rol requerido**: Cualquier usuario autenticado
- **Respuesta**: Lista de sedes con horarios y usuarios

#### Buscar Sedes
**GET** `/api/sedes/buscar?nombre=Principal&ciudad=Bogotá&estado=true`
- **Rol requerido**: Cualquier usuario autenticado
- **Parámetros**: nombre, ciudad, estado

#### Obtener Sede por ID
**GET** `/api/sedes/{sedeId}`
- **Rol requerido**: Cualquier usuario autenticado
- **Respuesta**: Sede con horarios y usuarios

#### Actualizar Sede
**PUT** `/api/sedes/{sedeId}`
- **Rol requerido**: Administrador
- **Body**: Cualquier campo de la sede

#### Eliminar Sede
**DELETE** `/api/sedes/{sedeId}`
- **Rol requerido**: Administrador
- **Nota**: Solo si no tiene usuarios asignados

#### Cambiar Estado
**PATCH** `/api/sedes/{sedeId}/estado`
- **Rol requerido**: Administrador
- **Body**: `{ "estado": true/false }`

#### Estadísticas de Sede
**GET** `/api/sedes/{sedeId}/estadisticas`
- **Rol requerido**: Cualquier usuario autenticado
- **Respuesta**: Estadísticas de usuarios y horarios

## 📚 API Endpoints - Horarios de Sede

### 🕐 Gestión de Horarios

#### Crear Horario
**POST** `/api/horarios-sede`
- **Rol requerido**: Administrador
- **Body**:
```json
{
  "sedeId": 1,
  "nombre": "Horario Lunes",
  "tipo": "normal",
  "diaSemana": 1,
  "horaEntrada": "08:00",
  "horaSalida": "17:00",
  "horasJornada": 8,
  "toleranciaEntrada": 15,
  "toleranciaSalida": 15,
  "descripcion": "Horario estándar de lunes"
}
```

#### Horarios de una Sede
**GET** `/api/horarios-sede/sede/{sedeId}`
- **Rol requerido**: Cualquier usuario autenticado
- **Respuesta**: Lista de horarios de la sede

#### Horario Semanal
**GET** `/api/horarios-sede/sede/{sedeId}/semanal`
- **Rol requerido**: Cualquier usuario autenticado
- **Respuesta**: Horarios organizados por día de la semana

#### Horario por Día
**GET** `/api/horarios-sede/sede/{sedeId}/dia/{diaSemana}?tipo=normal`
- **Rol requerido**: Cualquier usuario autenticado
- **Parámetros**: diaSemana (0-6), tipo (opcional)

#### Actualizar Horario
**PUT** `/api/horarios-sede/{horarioId}`
- **Rol requerido**: Administrador
- **Body**: Cualquier campo del horario

#### Eliminar Horario
**DELETE** `/api/horarios-sede/{horarioId}`
- **Rol requerido**: Administrador

#### Cambiar Estado de Horario
**PATCH** `/api/horarios-sede/{horarioId}/estado`
- **Rol requerido**: Administrador
- **Body**: `{ "activo": true/false }`

#### Crear Horarios por Defecto
**POST** `/api/horarios-sede/sede/{sedeId}/por-defecto`
- **Rol requerido**: Administrador
- **Body** (opcional):
```json
{
  "horaEntrada": "08:00",
  "horaSalida": "17:00",
  "horasJornada": 8,
  "toleranciaEntrada": 15,
  "toleranciaSalida": 15
}
```

## 🔧 Configuración de Horarios

### Tipos de Horario
1. **normal**: Horario estándar diurno
2. **nocturno**: Horario nocturno (22:00 - 6:00)
3. **especial**: Horarios especiales (sábados, festivos)
4. **festivo**: Horarios para días festivos

### Días de la Semana
- **0**: Domingo
- **1**: Lunes
- **2**: Martes
- **3**: Miércoles
- **4**: Jueves
- **5**: Viernes
- **6**: Sábado

### Tolerancias
- **toleranciaEntrada**: Minutos de tolerancia para la entrada
- **toleranciaSalida**: Minutos de tolerancia para la salida

## 📊 Cálculo de Horas Extra con Sedes

### Flujo de Cálculo
1. **Empleado registra horas** → Se verifica su sede asignada
2. **Se obtiene el horario** → Para el día específico de la sede
3. **Se calcula según horario** → Usando `horasJornada` de la sede
4. **Se determina tipo** → Normal, nocturno, etc.

### Ejemplo de Cálculo
```javascript
// Empleado de Sede Principal (8 horas de jornada)
// Registra: 08:00 - 18:00
// Resultado: 10 horas trabajadas, 2 horas extra

// Empleado de Sede Norte (10 horas de jornada)
// Registra: 07:00 - 18:00
// Resultado: 11 horas trabajadas, 1 hora extra
```

## 🎯 Casos de Uso

### 1. Crear una Nueva Sede
```bash
POST /api/sedes
{
  "nombre": "Sede Nueva",
  "direccion": "Calle Nueva #123",
  "ciudad": "Medellín",
  "telefono": "3001234567",
  "email": "nueva@empresa.com"
}
```

### 2. Configurar Horarios por Defecto
```bash
POST /api/horarios-sede/sede/1/por-defecto
{
  "horaEntrada": "08:00",
  "horaSalida": "17:00",
  "horasJornada": 8
}
```

### 3. Crear Horario Especial
```bash
POST /api/horarios-sede
{
  "sedeId": 1,
  "nombre": "Horario Sábado",
  "tipo": "especial",
  "diaSemana": 6,
  "horaEntrada": "08:00",
  "horaSalida": "13:00",
  "horasJornada": 5
}
```

### 4. Asignar Empleado a Sede
```bash
PUT /api/usuarios/1
{
  "sedeId": 1
}
```

### 5. Registrar Horas (con horario de sede)
```bash
POST /api/horas-trabajadas/registro
{
  "fecha": "2024-01-15",
  "horaEntrada": "08:00",
  "horaSalida": "18:00",
  "observaciones": "Trabajo extra"
}
```

## 📈 Estadísticas y Reportes

### Estadísticas por Sede
- Total de usuarios
- Cantidad de empleados
- Cantidad de supervisores
- Horarios activos

### Horario Semanal
- Vista organizada por días
- Múltiples horarios por día
- Tipos de horario diferenciados

## 🔐 Roles y Permisos

### Administrador
- ✅ Gestión completa de sedes
- ✅ Gestión completa de horarios
- ✅ Asignación de empleados
- ✅ Estadísticas y reportes

### JefeDirecto
- ✅ Ver sedes y horarios
- ✅ Ver empleados por sede
- ✅ Aprobar registros de horas

### Empleado
- ✅ Ver información de su sede
- ✅ Ver su horario asignado
- ✅ Registrar horas trabajadas

## 🐛 Solución de Problemas

### Error: "El empleado debe tener una sede asignada"
- Verificar que el empleado tenga `sedeId` asignado
- Usar el script `asignarEmpleadosASedes.js`

### Error: "No se encontró horario para el día"
- Verificar que existan horarios para la sede
- Crear horarios por defecto con `/por-defecto`

### Error: "Ya existe un horario para el día"
- Solo puede haber un horario por día y tipo
- Eliminar horario existente o usar otro tipo

### Error: "No se puede eliminar una sede que tiene usuarios"
- Reasignar usuarios a otra sede
- O desactivar la sede en lugar de eliminarla

## 📝 Notas Importantes

1. **Sede obligatoria**: Los empleados deben tener sede asignada para registrar horas
2. **Horarios únicos**: Un horario por día y tipo por sede
3. **Cálculo automático**: Las horas extra se calculan según el horario de la sede
4. **Tolerancias**: Configurables por horario
5. **Estados**: Sedes y horarios pueden activarse/desactivarse

## 🚀 Próximos Pasos

1. **Ejecutar scripts de inicialización**
2. **Configurar horarios específicos** para cada sede
3. **Asignar empleados** a sus sedes correspondientes
4. **Probar registro de horas** con diferentes horarios
5. **Revisar documentación** en `/api-docs`

## 📞 Soporte

Para problemas o consultas:
1. Revisar logs del servidor
2. Verificar estado de la base de datos
3. Consultar documentación Swagger
4. Verificar permisos y roles 