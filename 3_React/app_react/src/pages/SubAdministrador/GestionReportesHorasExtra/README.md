# Módulo GestionReportesHorasExtra

## Descripción
Este módulo permite a los Sub-Administradores gestionar y generar reportes detallados de horas extra para todos los usuarios del sistema. Incluye funcionalidades para visualizar registros, generar reportes y exportar documentos en formatos Word y Excel.

## Características Principales

### 🔍 Gestión de Usuarios
- Lista completa de usuarios con paginación
- Búsqueda por nombre, apellido, documento o email
- Visualización de detalles de usuario

### 📊 Registros de Horas Extra
- Visualización de todos los registros de horas extra por usuario
- Filtrado por estado (aprobado, pendiente, rechazado)
- Información detallada de cada registro

### 📈 Reportes y Exportación
- Generación de reportes consolidados de horas extra
- Cálculo automático de valores a pagar
- Exportación a formato Word (.docx) con logo corporativo
- Exportación a formato Excel (.xlsx) con estilos profesionales

### 💰 Cálculos Automáticos
- Cálculo de horas extra divididas
- Cálculo de bonos salariales
- Aplicación de recargos según tipo de hora
- Total consolidado a pagar

## Estructura de Archivos

```
GestionReportesHorasExtra/
├── index.jsx                 # Componente principal
├── components/
│   └── LoadingSpinner.jsx    # Spinner de carga personalizado
└── README.md                 # Esta documentación
```

## Dependencias

### Material-UI
- `Box`, `Paper`, `Typography`, `Table`, `Dialog`
- `IconButton`, `TablePagination`, `TextField`
- `Button`, `Divider`, `InputAdornment`

### Iconos
- `VisibilityIcon` - Ver detalles de usuario
- `ListAltIcon` - Ver registros de horas extra
- `ReceiptLongIcon` - Generar reporte
- `SearchIcon` - Búsqueda
- `PersonIcon` - Icono de usuario

### Librerías de Exportación
- `docx` - Generación de documentos Word
- `exceljs` - Generación de archivos Excel
- `file-saver` - Descarga de archivos

### Contextos
- `SalarioMinimoContext` - Acceso al salario mínimo del sistema

## Funcionalidades Técnicas

### Estado del Componente
- `usuarios` - Lista de usuarios del sistema
- `registros` - Registros de horas extra del usuario seleccionado
- `reporteData` - Datos consolidados del reporte
- `loading` - Estados de carga para diferentes operaciones

### API Endpoints
- `GET /api/usuarios` - Obtener lista de usuarios
- `GET /api/registros/usuario-completo/:id` - Obtener registros de usuario

### Cálculos
- **Valor Hora Ordinaria**: `salarioMinimo / 240`
- **Valor Hora Extra**: `valorHoraOrdinaria * recargo`
- **Total Divididas**: `cantidadDividida * valorHoraExtra`
- **Total Bono**: `cantidadBono * valorHoraOrdinaria`

## Uso

### Acceso al Módulo
El módulo se accede a través de la navegación del Sub-Administrador y está protegido por el sistema de roles.

### Flujo de Trabajo
1. **Selección de Usuario**: Buscar y seleccionar un usuario de la lista
2. **Visualización de Registros**: Revisar registros de horas extra del usuario
3. **Generación de Reporte**: Crear reporte consolidado con cálculos
4. **Exportación**: Descargar reporte en Word o Excel

### Personalización
- **Logo**: Utiliza `/img/NuevoLogo.png` para documentos Word
- **Colores**: Sigue la paleta de colores del sistema (#1976d2, #42a5f5)
- **Estilos**: Aplicación de gradientes y efectos visuales modernos

## Responsive Design
- Adaptación automática para dispositivos móviles
- Tablas con scroll horizontal en pantallas pequeñas
- Botones y controles optimizados para touch

## Notas de Implementación
- El módulo mantiene la consistencia visual con otros módulos del sistema
- Implementa el mismo patrón de diseño y arquitectura
- Utiliza el LoadingSpinner personalizado con logo corporativo
- Manejo de errores robusto con try-catch en todas las operaciones async

## Mantenimiento
- Verificar dependencias de librerías de exportación
- Actualizar endpoints de API si cambian
- Revisar cálculos de salarios y recargos
- Mantener compatibilidad con cambios en el contexto de salario mínimo
