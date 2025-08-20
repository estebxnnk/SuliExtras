# Componentes Universales del Módulo SubAdministrador

Este directorio contiene componentes reutilizables diseñados para mantener consistencia visual y funcional en todo el módulo SubAdministrador, **basados 100% en el estilo del módulo `GestionarRegistrosHorasExtra`**.

## 🎯 Filosofía de Diseño

Todos los componentes universales mantienen la **misma estética visual, estructura y comportamiento** que el módulo `GestionarRegistrosHorasExtra`, garantizando:

- **Consistencia total** en colores, tipografías y espaciados
- **Misma experiencia de usuario** en todos los módulos
- **Reutilización real** sin comprometer el diseño original
- **Fácil mantenimiento** con cambios centralizados

## 🏗️ Arquitectura de Componentes

### Componentes Base (Originales)
- **`SubAdminLayout`**: Layout básico con estructura simple
- **`SubAdminHeader`**: Header básico con funcionalidades mínimas
- **`SubAdminTable`**: Tabla básica con paginación estándar
- **`SubAdminAlerts`**: Sistema de alertas básico

### Componentes Universales (Nuevos - Basados en GestionarRegistrosHorasExtra)
- **`SubAdminLayoutUniversal`**: Layout que replica exactamente el estilo del módulo
- **`SubAdminHeaderUniversal`**: Header con el mismo diseño y funcionalidades
- **`SubAdminTableUniversal`**: Tabla con la misma estética y comportamiento
- **`SubAdminStatsUniversal`**: Componente de estadísticas con el mismo estilo

## 🚀 Componentes Universales

### 1. SubAdminLayoutUniversal

Layout que replica exactamente el estilo del módulo `GestionarRegistrosHorasExtra`:

```jsx
import { SubAdminLayoutUniversal } from '../components';

<SubAdminLayoutUniversal>
  {/* Contenido del módulo */}
</SubAdminLayoutUniversal>
```

**Características:**
- Fondo con imagen `/img/Recepcion.jpg`
- Contenedor con `backdropFilter: 'blur(10px)'`
- Gradiente `linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(240,248,255,0.98) 100%)`
- Borde con `rgba(25, 118, 210, 0.2)`
- Elevación 8 y `borderRadius: 4`

### 2. SubAdminHeaderUniversal

Header que mantiene la misma estética visual:

```jsx
<SubAdminHeaderUniversal
  title="Gestión de Usuarios"
  subtitle="Administra y gestiona usuarios del sistema"
  icon={PeopleIcon}
  iconColor="#9c27b0"
  refreshing={false}
  onRefresh={handleRefresh}
  showSearch={true}
  searchValue={search}
  onSearchChange={handleSearchChange}
  showAddButton={true}
  onAdd={handleAdd}
  showStats={true}
  stats={[
    { label: 'Total', value: 100, color: 'primary' },
    { label: 'Activos', value: 80, color: 'success' }
  ]}
/>
```

**Características:**
- Título con `textShadow: '0 2px 4px rgba(0,0,0,0.1)'`
- Gradiente de texto con `WebkitBackgroundClip: 'text'`
- Icono de 48px con color personalizable
- Campo de búsqueda con estilo consistente
- Botones con efectos hover y transformaciones
- Estadísticas integradas en el header

### 3. SubAdminTableUniversal

Tabla que replica exactamente el estilo de `TablaRegistros`:

```jsx
<SubAdminTableUniversal
  data={data}
  columns={columns}
  title="Usuarios del Sistema"
  subtitle="Lista completa de usuarios"
  page={page}
  rowsPerPage={rowsPerPage}
  totalCount={totalCount}
  onPageChange={handlePageChange}
  onRowsPerPageChange={handleRowsPerPageChange}
  onView={handleView}
  onEdit={handleEdit}
  onDelete={handleDelete}
  customActions={customActions}
  headerColor="#9c27b0"
  emptyMessage="No se encontraron datos"
/>
```

**Características:**
- Header de tabla con gradiente personalizable
- Filas con hover y `backgroundColor: 'rgba(0,0,0,0.02)'` en impares
- Acciones estándar (Ver, Editar, Eliminar, Aprobar, Rechazar)
- Acciones personalizadas con iconos y tooltips
- Paginación con estilo consistente
- Mensajes de estado (cargando, sin datos)

### 4. SubAdminStatsUniversal

Componente de estadísticas con el mismo estilo visual:

```jsx
<SubAdminStatsUniversal
  stats={[
    { type: 'total', label: 'Total Usuarios', value: 100, description: 'Usuarios registrados' },
    { type: 'empleados', label: 'Empleados', value: 80, description: 'Personal operativo' },
    { type: 'supervisores', label: 'Supervisores', value: 20, description: 'Personal de supervisión' }
  ]}
  title="Resumen del Sistema"
  subtitle="Métricas importantes"
  iconColor="#9c27b0"
/>
```

**Características:**
- Grid responsivo de estadísticas
- Iconos automáticos según el tipo
- Colores automáticos según el tipo
- Efectos hover con `transform: 'translateY(-4px)'`
- Sombras dinámicas con colores del tipo

## 📋 Estructura de Datos

### Columnas de Tabla
```jsx
const columns = [
  { 
    id: 'nombre', 
    label: 'Nombre', 
    render: (value, row) => (
      <span style={{ fontWeight: 600, color: '#1976d2' }}>{value}</span>
    )
  }
];
```

### Acciones Personalizadas
```jsx
const customActions = [
  {
    icon: '📊',
    tooltip: 'Ver reporte',
    color: '#9c27b0',
    onClick: (row) => handleAction(row)
  }
];
```

### Estadísticas
```jsx
const stats = [
  { 
    type: 'total', 
    label: 'Total Usuarios', 
    value: 100, 
    description: 'Usuarios registrados' 
  }
];
```

## 🎨 Personalización Visual

### Colores del Módulo
```jsx
// Colores principales del módulo GestionarRegistrosHorasExtra
const colors = {
  primary: '#1976d2',      // Azul principal
  secondary: '#9c27b0',    // Púrpura
  success: '#4caf50',      // Verde
  warning: '#ff9800',      // Naranja
  error: '#f44336',        // Rojo
  info: '#2196f3'          // Azul claro
};
```

### Gradientes
```jsx
// Gradientes utilizados en el módulo
const gradients = {
  header: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
  container: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(240,248,255,0.98) 100%)',
  button: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)'
};
```

## 🔧 Ejemplo de Implementación Completa

```jsx
import React, { useState } from 'react';
import { 
  SubAdminLayoutUniversal,
  SubAdminHeaderUniversal,
  SubAdminTableUniversal,
  SubAdminStatsUniversal
} from '../components';

const MiModulo = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'nombre', label: 'Nombre' }
  ];

  const stats = [
    { type: 'total', label: 'Total', value: 100 }
  ];

  return (
    <SubAdminLayoutUniversal>
      <SubAdminHeaderUniversal
        title="Mi Módulo"
        subtitle="Descripción del módulo"
        showSearch={true}
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        showStats={true}
        stats={stats}
      />
      
      <SubAdminStatsUniversal
        stats={stats}
        title="Estadísticas"
        iconColor="#1976d2"
      />
      
      <SubAdminTableUniversal
        data={data}
        columns={columns}
        title="Datos del Módulo"
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={data.length}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
        onView={(row) => console.log('Ver:', row)}
        onEdit={(row) => console.log('Editar:', row)}
        onDelete={(row) => console.log('Eliminar:', row)}
      />
    </SubAdminLayoutUniversal>
  );
};
```

## 📁 Organización de Archivos

```
components/
├── index.js                      # Exporta todos los componentes
├── SubAdminLayout.jsx            # Layout base (original)
├── SubAdminHeader.jsx            # Header base (original)
├── SubAdminTable.jsx             # Tabla base (original)
├── SubAdminAlerts.jsx            # Alertas base (original)
├── SubAdminLayoutUniversal.jsx   # Layout universal (nuevo)
├── SubAdminHeaderUniversal.jsx   # Header universal (nuevo)
├── SubAdminTableUniversal.jsx    # Tabla universal (nuevo)
├── SubAdminStatsUniversal.jsx    # Estadísticas universal (nuevo)
├── ExampleUsage.jsx              # Ejemplo de implementación
├── README.md                     # Esta documentación
└── styles.js                     # Estilos comunes
```

## 🎯 Beneficios de la Nueva Implementación

1. **Consistencia Visual 100%**: Mismo diseño que `GestionarRegistrosHorasExtra`
2. **Reutilización Real**: Componentes que realmente se ven igual
3. **Mantenimiento Simplificado**: Cambios centralizados en un lugar
4. **Experiencia Unificada**: Usuarios ven la misma interfaz en todos los módulos
5. **Desarrollo Acelerado**: No más recrear estilos desde cero

## 🔄 Migración de Módulos Existentes

Para migrar un módulo existente a los nuevos componentes:

1. **Reemplazar layout**: Cambiar `Box`/`Paper` por `SubAdminLayoutUniversal`
2. **Reemplazar header**: Cambiar header personalizado por `SubAdminHeaderUniversal`
3. **Reemplazar tabla**: Cambiar tabla MUI por `SubAdminTableUniversal`
4. **Agregar estadísticas**: Usar `SubAdminStatsUniversal` para métricas
5. **Adaptar acciones**: Mapear funciones existentes a las props del componente

## 📞 Soporte

Para dudas o problemas con estos componentes:
- Revisar esta documentación
- Ver ejemplos en `ExampleUsage.jsx`
- Consultar la implementación en `GestionarRegistrosHorasExtra/`
- Revisar los estilos en `styles.js`

## 🚨 Importante

**Estos componentes están diseñados para ser una réplica exacta del estilo de `GestionarRegistrosHorasExtra`**. Si necesitas cambios en el diseño, modifica primero el módulo original y luego actualiza los componentes universales para mantener la consistencia.
