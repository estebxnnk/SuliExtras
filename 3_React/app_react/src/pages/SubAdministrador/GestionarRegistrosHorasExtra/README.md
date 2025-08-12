# Módulo: Gestionar Registros de Horas Extra

## Descripción
Este módulo permite a los SubAdministradores gestionar todos los registros de horas extra del sistema, incluyendo la creación, visualización, edición, aprobación, rechazo y eliminación de registros.

## Funcionalidades Principales

### 1. Panel Principal (`index.jsx`)
- **Visualización de registros**: Tabla con todos los registros de horas extra
- **Filtros**: Búsqueda por usuario, número de registro o ubicación
- **Filtro por estado**: Pendiente, Aprobado, Rechazado
- **Paginación**: Navegación entre páginas de resultados
- **Acciones en lote**: Aprobar, rechazar, editar y eliminar registros

### 2. Creación de Registros (`CrearRegistroHorasExtra.jsx`)
- **Formulario completo**: Captura de toda la información necesaria
- **Validaciones**: Campos requeridos y validaciones de negocio
- **Cálculo automático**: Horas extra basadas en horarios de entrada/salida
- **Selección de empleados**: Lista de usuarios disponibles
- **Tipos de hora**: Selección del tipo de hora extra con recargos

### 3. Gestión de Estados
- **Estados disponibles**: Pendiente, Aprobado, Rechazado
- **Flujo de trabajo**: Solo registros pendientes pueden ser editados completamente
- **Cambio de estado**: Registros procesados solo pueden cambiar estado

## Estructura del Módulo

```
GestionarRegistrosHorasExtra/
├── index.jsx                           # Componente principal
├── CrearRegistroHorasExtra.jsx         # Formulario de creación
├── hooks/
│   └── useGestionarRegistrosHorasExtra.js  # Lógica de negocio
├── services/
│   └── gestionarRegistrosHorasExtraService.js  # Llamadas a API
└── README.md                           # Documentación
```

## Arquitectura

### Hook Personalizado (`useGestionarRegistrosHorasExtra.js`)
- **Estado centralizado**: Manejo de todos los estados del módulo
- **Lógica de negocio**: Funciones para cada operación CRUD
- **Manejo de errores**: Gestión centralizada de errores y mensajes
- **Paginación**: Control de páginas y filas por página

### Servicio (`gestionarRegistrosHorasExtraService.js`)
- **API REST**: Comunicación con el backend
- **Métodos CRUD**: Create, Read, Update, Delete
- **Manejo de errores**: Captura y propagación de errores HTTP
- **URLs centralizadas**: Configuración de endpoints en un solo lugar

## Rutas del Sistema

### Rutas del Módulo
- **Panel principal**: `/subadmin/gestionar-registros-horas-extra`
- **Crear registro**: `/subadmin/crear-registros-horas-extra`

### Navegación
- **Botón "Volver"**: Retorna al panel principal
- **Botón "Crear Nuevo Registro"**: Navega al formulario de creación
- **Redirección automática**: Después de crear un registro exitosamente

## Campos del Registro

### Información Básica
- **Fecha**: Fecha del registro
- **Empleado**: Usuario seleccionado del sistema
- **Documento**: Tipo y número de documento del empleado

### Horarios
- **Hora de Ingreso**: Inicio de la jornada laboral
- **Hora de Salida**: Fin de la jornada laboral
- **Cálculo automático**: Horas extra (jornada - 8 horas normales)

### Detalles del Registro
- **Ubicación**: Área o lugar de trabajo
- **Cantidad de Horas Extra**: Horas trabajadas adicionales
- **Tipo de Hora**: Categoría con recargo correspondiente
- **Justificación**: Motivo de las horas extra (opcional)

### Campos del Sistema
- **Número de Registro**: Generado automáticamente (REG-{timestamp})
- **Estado**: Pendiente (por defecto), Aprobado, Rechazado
- **Horas Extra Divididas**: Para reportes (máximo 2 horas)
- **Bono Salarial**: Horas adicionales para bonificación

## Validaciones

### Campos Requeridos
- Fecha del registro
- Empleado seleccionado
- Hora de ingreso
- Hora de salida
- Ubicación
- Cantidad de horas extra
- Tipo de hora extra

### Validaciones de Negocio
- **Horas extra mínimas**: Mínimo 1 hora
- **Horas extra reporte**: Máximo 2 horas por registro
- **Estado para edición**: Solo registros pendientes pueden editarse completamente
- **Cambio de estado**: Registros procesados solo pueden cambiar estado

## Estados del Registro

### Pendiente
- **Edición completa**: Todos los campos editables
- **Acciones disponibles**: Aprobar, Rechazar, Editar, Eliminar
- **Estado inicial**: Todos los registros nuevos

### Aprobado
- **Edición limitada**: Solo cambio de estado
- **Acciones disponibles**: Cambiar estado, Eliminar
- **Procesamiento**: Registro validado y aceptado

### Rechazado
- **Edición limitada**: Solo cambio de estado
- **Acciones disponibles**: Cambiar estado, Eliminar
- **Procesamiento**: Registro no aprobado

## Interfaz de Usuario

### Diseño Responsivo
- **Grid system**: Adaptable a diferentes tamaños de pantalla
- **Cards organizadas**: Información agrupada por secciones
- **Iconos descriptivos**: Identificación visual de campos
- **Colores temáticos**: Diferentes colores por sección

### Componentes Material-UI
- **TextField**: Campos de entrada con validación
- **Select**: Listas desplegables para opciones
- **Button**: Botones con iconos y estados
- **Alert**: Mensajes de éxito, error e información
- **Table**: Tabla de registros con paginación
- **Dialog**: Ventanas modales para acciones

## Manejo de Errores

### Errores de Validación
- **Campos requeridos**: Mensajes específicos por campo
- **Validaciones de negocio**: Horas mínimas, máximas, etc.
- **Formato de datos**: Validación de tipos y rangos

### Errores de API
- **Conexión**: Problemas de red o servidor
- **Autenticación**: Sesión expirada o permisos insuficientes
- **Datos**: Información incorrecta o conflictos

### Mensajes de Usuario
- **Éxito**: Confirmación de operaciones completadas
- **Error**: Descripción clara del problema
- **Información**: Guías y ayudas contextuales

## Seguridad y Permisos

### Roles de Usuario
- **SubAdministrador**: Acceso completo al módulo
- **Permisos**: Crear, leer, actualizar, eliminar registros
- **Alcance**: Todos los registros del sistema

### Validaciones de Seguridad
- **Autenticación**: Usuario debe estar logueado
- **Autorización**: Verificación de rol SubAdministrador
- **Datos sensibles**: Protección de información personal

## Mantenimiento y Escalabilidad

### Código Limpio
- **Separación de responsabilidades**: UI, lógica y servicios separados
- **Reutilización**: Hooks y servicios reutilizables
- **Mantenibilidad**: Código bien documentado y estructurado

### Performance
- **Paginación**: Carga limitada de registros
- **Filtros**: Búsqueda eficiente en el frontend
- **Estado local**: Minimización de re-renders

### Extensibilidad
- **Módulos independientes**: Fácil agregar nuevas funcionalidades
- **APIs flexibles**: Servicios adaptables a cambios del backend
- **Componentes reutilizables**: UI components modulares

## Dependencias

### React y Hooks
- `useState`: Estado local de componentes
- `useEffect`: Efectos secundarios y llamadas a API
- `useNavigate`: Navegación programática

### Material-UI
- Componentes de UI: `TextField`, `Button`, `Table`, etc.
- Iconos: `AccessTimeIcon`, `PersonIcon`, `WorkIcon`, etc.
- Sistema de grid y layout

### Servicios
- `fetch`: Llamadas HTTP a la API
- Manejo de errores y respuestas JSON

## Consideraciones Futuras

### Mejoras Planificadas
- **Filtros avanzados**: Por fecha, rango de horas, etc.
- **Exportación**: PDF, Excel de registros
- **Notificaciones**: Alertas en tiempo real
- **Auditoría**: Historial de cambios en registros

### Integración
- **Sistema de notificaciones**: Email, SMS
- **Reportes automáticos**: Generación programada
- **API externas**: Integración con sistemas de nómina
- **Backup**: Respaldo automático de datos

## Soporte y Contacto

Para soporte técnico o preguntas sobre este módulo, contactar al equipo de desarrollo o revisar la documentación del sistema principal. 