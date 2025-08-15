# PanelSubAdmin - Módulo Refactorizado

## 🏗️ Arquitectura Modular

Este módulo ha sido refactorizado siguiendo la misma arquitectura que `GestionarDispositivos` para mantener consistencia en el proyecto.

## 📁 Estructura de Directorios

```
PanelSubAdmin/
├── index.jsx                 # Componente principal
├── hooks/
│   └── usePanelSubAdmin.js   # Hook personalizado para lógica de negocio
├── services/
│   └── subAdminService.js    # Servicios para API calls
├── components/               # Componentes UI reutilizables
│   ├── FiltrosPanel.jsx     # Panel de filtros
│   ├── KPICards.jsx         # Tarjetas de métricas
│   ├── UsuariosTable.jsx    # Tabla de usuarios
│   ├── GraficoUsuarios.jsx  # Gráfico de distribución
│   └── UsuarioDialog.jsx    # Diálogo de detalles de usuario
└── README.md                # Este archivo
```

## 🔧 Componentes

### `index.jsx`
- **Responsabilidad**: Componente principal que orquesta todos los sub-componentes
- **Props**: No recibe props externos
- **Estado**: Utiliza el hook `usePanelSubAdmin`

### `usePanelSubAdmin.js`
- **Responsabilidad**: Lógica de negocio, estado y efectos
- **Estados**:
  - `usuarios`, `roles`, `registros`: Datos principales
  - `loading`, `rolFiltro`, `datePreset`: Estados de UI
  - `modalUsuario`: Estado del diálogo
- **Funciones**:
  - `fetchData`: Carga inicial de datos
  - `handleFiltroRol`, `handleOpenUsuario`: Handlers de eventos
  - Cálculos de métricas y filtros

### `subAdminService.js`
- **Responsabilidad**: Todas las llamadas a la API
- **Endpoints**:
  - `GET /api/usuarios`: Obtener usuarios
  - `GET /api/roles`: Obtener roles
  - `GET /api/registros`: Obtener registros
  - `GET /api/registros/usuario-completo/{id}`: Registros de usuario
  - `POST /api/auth/register`: Crear usuario
  - `PUT /api/usuarios/{id}`: Actualizar usuario
  - `DELETE /api/usuarios/{id}`: Eliminar usuario
  - `POST /api/roles`: Crear rol
  - `PUT /api/usuarios/{id}/rol`: Cambiar rol

### Componentes UI

#### `FiltrosPanel.jsx`
- Filtro por rol
- Filtro por rango de fechas
- Diseño responsive

#### `KPICards.jsx`
- Métricas de usuarios (total, activos, pendientes)
- Métricas de registros (total, aprobados, pendientes)
- Diseño con hover effects

#### `UsuariosTable.jsx`
- Tabla de usuarios recientes
- Filtrado automático según filtros aplicados
- Límite de 10 usuarios mostrados
- Acciones para ver detalles

#### `GraficoUsuarios.jsx`
- Gráfico de torta con distribución por rol
- Leyenda interactiva
- Responsive para móviles

#### `UsuarioDialog.jsx`
- Información personal del usuario
- Información del sistema (rol, estado)
- Tabla de registros de horas extra
- Diseño responsive

## 🚀 Características

### ✅ Ventajas de la Nueva Arquitectura

1. **Separación de Responsabilidades**
   - Lógica de negocio en hooks
   - Llamadas a API en servicios
   - UI en componentes

2. **Reutilización**
   - Componentes modulares
   - Hooks reutilizables
   - Servicios centralizados

3. **Mantenibilidad**
   - Código organizado y legible
   - Fácil debugging
   - Testing simplificado

4. **Performance**
   - Memoización con `useMemo`
   - Carga optimizada de datos
   - Actualización automática cada 30 segundos

5. **Responsive Design**
   - Adaptación a móviles y tablets
   - Gráficos que se ocultan en móviles
   - Layout flexible

### 🔄 Flujo de Datos

1. **Carga Inicial**: `useEffect` → `fetchData` → `subAdminService`
2. **Filtros**: Cambios en filtros → recálculo automático de métricas
3. **Interacciones**: Click en usuario → `handleOpenUsuario` → carga de registros
4. **Actualización**: Botón refresh → `handleRefresh` → `fetchData`

## 📱 Responsive Design

- **Mobile**: Gráficos ocultos, diálogos fullscreen
- **Tablet**: Layout adaptativo, componentes redimensionados
- **Desktop**: Layout completo con todos los elementos

## 🎨 Estilo y UI

- **Material-UI**: Componentes consistentes
- **Glassmorphism**: Efectos de transparencia y blur
- **Hover Effects**: Interacciones visuales
- **Color Scheme**: Paleta de colores coherente
- **Typography**: Jerarquía visual clara

## 🔧 Configuración

### API Base URL
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

### Actualización Automática
```javascript
const interval = setInterval(fetchData, 30000); // 30 segundos
```

### Filtros Disponibles
- **Rol**: Filtro por rol específico
- **Fecha**: Hoy, últimos 7 días, último mes, todos

## 🚀 Uso

```jsx
import PanelSubAdmin from './PanelSubAdmin';

// En tu router o componente padre
<PanelSubAdmin />
```

## 📝 Notas de Desarrollo

- Los componentes están optimizados para evitar re-renders innecesarios
- Se utiliza `useMemo` para cálculos costosos
- El estado se mantiene sincronizado entre componentes
- Los errores se manejan de forma robusta en el servicio

## 🔮 Futuras Mejoras

1. **Paginación**: Implementar paginación en la tabla de usuarios
2. **Búsqueda**: Agregar búsqueda por nombre o email
3. **Exportación**: Exportar datos a CSV/Excel
4. **Notificaciones**: Sistema de notificaciones en tiempo real
5. **Caché**: Implementar caché de datos para mejor performance 