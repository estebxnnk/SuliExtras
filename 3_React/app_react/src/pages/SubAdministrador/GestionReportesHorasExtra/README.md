# Gestión de Reportes de Horas Extra

Este módulo ha sido completamente migrado para usar los componentes reutilizables del SubAdministrador, siguiendo la misma arquitectura que el módulo `GestionarRegistrosHorasExtra`. Mantiene toda su funcionalidad original mientras mejora la consistencia visual, la mantenibilidad del código y la separación de responsabilidades.

## 🏗️ **Arquitectura del Módulo**

### **Estructura de Directorios**
```
GestionReportesHorasExtra/
├── components/           # Componentes de UI reutilizables
│   ├── HeaderGestionReportes.jsx
│   ├── TablaUsuarios.jsx
│   └── index.js
├── hooks/               # Lógica de negocio y estado
│   ├── useGestionReportes.js
│   ├── useAccionesReportes.js
│   ├── useAlertasReportes.js
│   └── index.js
├── services/            # Capa de servicios y API
│   ├── gestionReportesService.js
│   └── index.js
├── config/              # Configuración del módulo
│   └── index.js
├── utils/               # Utilidades de exportación
├── index.jsx            # Componente principal
└── README.md
```

## 🔧 **Componentes Implementados**

### **1. HeaderGestionReportes**
- Header reutilizable con título, subtítulo y campo de búsqueda
- Botón para editar salario mínimo
- Integrado con `SubAdminHeader` para consistencia visual

### **2. TablaUsuarios**
- Tabla reutilizable con paginación y acciones personalizadas
- Columnas: Nombres, Apellidos, Documento, Email, Fecha de Creación
- Acciones: Ver detalles, Ver registros, Generar reporte
- Integrado con `SubAdminTable` para consistencia

## 🎣 **Hooks Personalizados**

### **useGestionReportes**
- Maneja todo el estado del módulo
- Gestiona usuarios, registros, reportes y paginación
- Proporciona funciones de filtrado y paginación

### **useAccionesReportes**
- Encapsula todas las acciones del módulo
- Maneja operaciones CRUD y generación de reportes
- Gestiona descargas de Word y Excel

### **useAlertasReportes**
- Sistema de alertas centralizado
- Maneja diferentes tipos de alertas (success, error, warning, info)
- Integrado con `SubAdminUniversalAlert`

## 🚀 **Servicios**

### **gestionReportesService**
- `fetchUsuarios()`: Obtiene lista de usuarios
- `fetchRegistrosUsuario(usuarioId)`: Obtiene registros de un usuario
- `fetchRegistrosAprobados(usuarioId)`: Obtiene registros aprobados
- `calcularReporte(registros, salarioMinimo)`: Calcula reportes

## ⚙️ **Configuración**

### **CONFIG**
- Configuración de API y endpoints
- Configuración de paginación y búsqueda
- Configuración de exportación
- Colores y estilos del módulo
- Mensajes del sistema

## 🎨 **Tema Visual**

### **Colores del Módulo**
- **Primario**: #9c27b0 (Morado)
- **Secundario**: #7b1fa2 (Morado oscuro)
- **Gradientes**: Morado a morado oscuro
- **Consistencia**: Sigue el tema del SubAdministrador

## 📱 **Funcionalidades**

### **Gestión de Usuarios**
- Lista de usuarios con búsqueda y paginación
- Filtrado por nombre, apellido, documento o email
- Ordenamiento por fecha de creación

### **Visualización de Registros**
- Detalles completos de cada usuario
- Registros de horas extra con estados
- Información de tipos de hora y bonos

### **Generación de Reportes**
- Reportes detallados de horas extra
- Cálculos automáticos de valores
- Exportación a Word y Excel

### **Gestión de Salario**
- Edición del salario mínimo
- Cálculos automáticos de valores por hora
- Integración con el contexto global

## 🔄 **Migración Completada**

### **Componentes Reutilizables Adoptados**
- ✅ `SubAdminLayout` - Layout principal
- ✅ `SubAdminHeader` - Header del módulo
- ✅ `SubAdminTable` - Tabla de usuarios
- ✅ `SubAdminUniversalAlert` - Sistema de alertas

### **Beneficios de la Migración**
- **Consistencia Visual**: Mismo diseño en todo el módulo SubAdministrador
- **Mantenibilidad**: Código organizado y separado por responsabilidades
- **Reutilización**: Componentes que se pueden usar en otros módulos
- **Escalabilidad**: Fácil agregar nuevas funcionalidades
- **Testing**: Hooks y servicios fáciles de probar

## 🚀 **Uso del Módulo**

### **Importación de Componentes**
```jsx
import { 
  HeaderGestionReportes,
  TablaUsuarios 
} from './components';

import { 
  useGestionReportes,
  useAccionesReportes,
  useAlertasReportes 
} from './hooks';
```

### **Uso de Hooks**
```jsx
const {
  usuarios,
  usuariosFiltrados,
  usuariosPagina,
  // ... otros estados
} = useGestionReportes();

const {
  handleRefresh,
  handleVerDetalles,
  // ... otras acciones
} = useAccionesReportes(setAlertState, setLoadingRegistros, setRegistros, setReporteData, valorHoraOrdinaria);
```

## 📋 **Próximos Pasos**

1. **Testing**: Implementar tests unitarios para hooks y servicios
2. **Optimización**: Implementar memoización para mejor rendimiento
3. **Internacionalización**: Agregar soporte para múltiples idiomas
4. **Accesibilidad**: Mejorar la accesibilidad del módulo

---

El módulo se integra perfectamente con el sistema de navegación del SubAdministrador y mantiene todas las funcionalidades originales mientras proporciona una experiencia de usuario mejorada y consistente.
