# Gestión de Reportes de Horas Extra

Este módulo permite a los sub-administradores generar reportes detallados de horas extra para todos los usuarios del sistema, siguiendo la misma arquitectura y patrones de diseño establecidos en el proyecto.

## 🏗️ Arquitectura

El módulo sigue el patrón de **separación de responsabilidades** establecido en el proyecto:

```
GestionReportesHorasExtra/
├── components/           # Componentes de UI reutilizables
│   ├── LoadingSpinner.jsx
│   ├── Filtros.jsx
│   ├── UsuariosTable.jsx
│   └── index.js
├── hooks/               # Lógica de estado y efectos
│   ├── useGestionReportes.js
│   └── index.js
├── services/            # Lógica de negocio y API
│   ├── gestionReportesService.js
│   └── index.js
├── utils/               # Utilidades y funciones auxiliares
│   ├── exportUtils.js
│   └── index.js
├── config/              # Configuración del módulo
│   └── index.js
├── index.jsx            # Componente principal
└── README.md
```

## 🎯 Funcionalidades

### Core Features
- **Listado de Usuarios**: Visualización paginada de todos los usuarios del sistema
- **Búsqueda Avanzada**: Filtrado por nombre, apellido, documento o email
- **Gestión de Registros**: Visualización de registros de horas extra por usuario
- **Generación de Reportes**: Cálculo automático de totales y valores a pagar
- **Exportación**: Descarga de reportes en formato Word (.docx) y Excel (.xlsx)

### Características Técnicas
- **Responsive Design**: Adaptable a diferentes tamaños de pantalla
- **Lazy Loading**: Carga dinámica de utilidades de exportación
- **Estado Centralizado**: Gestión de estado mediante hooks personalizados
- **Manejo de Errores**: Gestión robusta de errores y estados de carga

## 🔧 Componentes

### LoadingSpinner
Spinner de carga personalizado con logo de la empresa y animaciones.

### Filtros
Sistema de filtrado con búsqueda en tiempo real y diseño moderno.

### UsuariosTable
Tabla de usuarios con acciones para ver detalles, registros y generar reportes.

## 📊 Hooks

### useGestionReportes
Hook principal que maneja:
- Estado de usuarios y registros
- Lógica de paginación y filtrado
- Cálculos de reportes
- Gestión de diálogos

## 🌐 Servicios

### gestionReportesService
- `fetchUsuarios()`: Obtiene lista de usuarios
- `fetchRegistrosUsuario(id)`: Obtiene registros de un usuario específico
- `fetchRegistrosAprobados(id)`: Obtiene registros aprobados para reportes

## 📁 Utilidades

### exportUtils
- `generarDocumentoWord()`: Genera documentos Word con formato profesional
- `generarDocumentoExcel()`: Genera hojas de cálculo Excel con estilos
- `descargarWord()`: Descarga automática de documentos Word
- `descargarExcel()`: Descarga automática de hojas Excel

## ⚙️ Configuración

### CONFIG
- **API**: Endpoints y configuración de base de datos
- **PAGINATION**: Opciones de paginación
- **SEARCH**: Configuración de búsqueda
- **EXPORT**: Configuración de exportación
- **STYLES**: Colores y gradientes del tema
- **MESSAGES**: Mensajes del sistema
- **CALCULATIONS**: Parámetros de cálculo

## 🚀 Uso

```jsx
import GestionReportesHorasExtra from './pages/SubAdministrador/GestionReportesHorasExtra';

// El componente se integra automáticamente con:
// - NavbarSubAdmin
// - SalarioMinimoContext
// - Sistema de rutas
```

## 🔗 Dependencias

- **Material-UI**: Componentes de UI
- **docx**: Generación de documentos Word
- **exceljs**: Generación de hojas Excel
- **file-saver**: Descarga de archivos

## 📱 Responsive Design

El módulo está optimizado para:
- **Desktop**: Vista completa con todas las funcionalidades
- **Tablet**: Adaptación de layouts y tamaños
- **Mobile**: Navegación optimizada y componentes adaptados

## 🎨 Tema y Estilos

- **Colores Primarios**: Azul (#1976d2) y variantes
- **Gradientes**: Efectos visuales modernos
- **Sombras**: Profundidad y jerarquía visual
- **Transiciones**: Animaciones suaves y profesionales

## 🔒 Seguridad

- **Validación de Datos**: Verificación de entrada de usuario
- **Manejo de Errores**: Gestión segura de excepciones
- **Contexto de Usuario**: Verificación de permisos y roles

## 📈 Rendimiento

- **Lazy Loading**: Carga diferida de utilidades pesadas
- **Memoización**: Optimización de re-renderizados
- **Paginación**: Carga eficiente de grandes volúmenes de datos
- **Debounce**: Optimización de búsquedas en tiempo real

## 🧪 Testing

El módulo está diseñado para facilitar:
- **Unit Testing**: Funciones puras y hooks
- **Integration Testing**: Flujos de usuario completos
- **E2E Testing**: Casos de uso reales

## 🔄 Mantenimiento

### Estructura Modular
- **Separación Clara**: Cada capa tiene responsabilidades específicas
- **Fácil Extensión**: Nuevas funcionalidades se integran sin modificar código existente
- **Reutilización**: Componentes y utilidades pueden ser reutilizados en otros módulos

### Patrones Establecidos
- **Consistencia**: Mismo estilo y estructura que otros módulos del proyecto
- **Escalabilidad**: Arquitectura preparada para crecimiento futuro
- **Legibilidad**: Código claro y bien documentado
