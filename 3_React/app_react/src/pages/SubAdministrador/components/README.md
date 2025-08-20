# Componentes Reutilizables del SubAdministrador

Este directorio contiene componentes reutilizables que mantienen la consistencia visual y funcional en todo el módulo de SubAdministrador.

## Componentes Disponibles

### 1. SubAdminLayout
Componente de layout principal que proporciona el fondo, contenedor y navbar para todos los módulos.

```jsx
import { SubAdminLayout } from '../components';

<SubAdminLayout maxWidth={1400} showNavbar={true}>
  {/* Contenido del módulo */}
</SubAdminLayout>
```

**Props:**
- `children`: Contenido del módulo
- `maxWidth`: Ancho máximo del contenedor (default: 1400)
- `showNavbar`: Mostrar/ocultar navbar (default: true)

### 2. SubAdminHeader
Header reutilizable con título, subtítulo, botones de acción y diseño consistente.

```jsx
import { SubAdminHeader } from '../components';

<SubAdminHeader
  title="Título del Módulo"
  subtitle="Descripción del módulo"
  refreshing={false}
  onRefresh={handleRefresh}
  onAdd={handleAdd}
  addButtonText="Agregar Nuevo"
  icon={PersonIcon}
  iconColor="#1976d2"
  gradientColors={["#1976d2", "#1565c0"]}
>
  {/* Contenido adicional del header */}
</SubAdminHeader>
```

**Props:**
- `title`: Título principal del módulo
- `subtitle`: Subtítulo descriptivo
- `refreshing`: Estado de carga para el botón de refresh
- `onRefresh`: Función para refrescar datos
- `onAdd`: Función para agregar nuevo elemento
- `addButtonText`: Texto del botón de agregar
- `showAddButton`: Mostrar/ocultar botón de agregar (default: true)
- `showRefreshButton`: Mostrar/ocultar botón de refresh (default: true)
- `showSettingsButton`: Mostrar/ocultar botón de configuración (default: false)
- `onSettings`: Función para configuración
- `icon`: Icono del header
- `iconColor`: Color del icono
- `gradientColors`: Colores del gradiente del header
- `children`: Contenido adicional del header

### 3. SubAdminTable
Tabla reutilizable con diseño consistente, paginación y acciones personalizables.

```jsx
import { SubAdminTable } from '../components';

const columns = [
  {
    id: 'nombre',
    label: 'Nombre',
    render: (value, row) => <CustomComponent value={value} />
  },
  { id: 'email', label: 'Email' }
];

<SubAdminTable
  data={usuarios}
  columns={columns}
  title="Usuarios del Sistema"
  subtitle="Lista de usuarios registrados"
  icon={PersonIcon}
  iconColor="#1976d2"
  gradientColors={["#f8f9fa", "#e9ecef"]}
  onView={handleView}
  onEdit={handleEdit}
  onDelete={handleDelete}
  actions={['view', 'edit', 'delete']}
  showPagination={true}
  page={page}
  rowsPerPage={rowsPerPage}
  totalCount={totalCount}
  onPageChange={handlePageChange}
  onRowsPerPageChange={handleRowsPerPageChange}
  emptyMessage="No hay usuarios para mostrar"
>
  {/* Contenido adicional antes de la tabla */}
</SubAdminTable>
```

**Props:**
- `data`: Array de datos a mostrar
- `columns`: Array de definiciones de columnas
- `title`: Título de la tabla
- `subtitle`: Subtítulo de la tabla
- `icon`: Icono del header de la tabla
- `iconColor`: Color del icono
- `gradientColors`: Colores del gradiente del header
- `onView`: Función para ver detalles
- `onEdit`: Función para editar
- `onDelete`: Función para eliminar
- `onApprove`: Función para aprobar
- `onReject`: Función para rechazar
- `actions`: Array de acciones a mostrar
- `customActions`: Array de acciones personalizadas
- `showPagination`: Mostrar/ocultar paginación
- `page`: Página actual
- `rowsPerPage`: Filas por página
- `totalCount`: Total de registros
- `onPageChange`: Función de cambio de página
- `onRowsPerPageChange`: Función de cambio de filas por página
- `loading`: Estado de carga
- `emptyMessage`: Mensaje cuando no hay datos
- `showActions`: Mostrar/ocultar columna de acciones
- `children`: Contenido adicional antes de la tabla

### 4. SubAdminAlerts
Sistema de alertas reutilizable con diferentes tipos y estilos.

#### SubAdminAlert
Alerta individual con diseño personalizable.

```jsx
import { SubAdminAlert } from '../components';

<SubAdminAlert
  type="success"
  message="Operación completada exitosamente"
  title="Éxito"
  showLogo={true}
  elevation={3}
>
  {/* Contenido adicional */}
</SubAdminAlert>
```

#### SubAdminUniversalAlert
Alerta universal que se muestra como Snackbar.

```jsx
import { SubAdminUniversalAlert } from '../components';

<SubAdminUniversalAlert
  open={alertState.open}
  type={alertState.type}
  message={alertState.message}
  title={alertState.title}
  onClose={hideAlert}
  showLogo={true}
  autoHideDuration={4000}
  position={{ vertical: 'top', horizontal: 'right' }}
/>
```

#### SubAdminSuccessSpinner
Spinner de éxito con mensaje personalizable.

```jsx
import { SubAdminSuccessSpinner } from '../components';

<SubAdminSuccessSpinner
  open={showSpinner}
  message="Operación completada exitosamente"
  showLogo={true}
  onComplete={hideSpinner}
  autoHideDuration={3000}
  type="success"
/>
```

#### SubAdminConfirmDialog
Diálogo de confirmación reutilizable.

```jsx
import { SubAdminConfirmDialog } from '../components';

<SubAdminConfirmDialog
  open={confirmDialog.open}
  title="Confirmar Acción"
  message="¿Estás seguro de que deseas realizar esta acción?"
  confirmText="Confirmar"
  cancelText="Cancelar"
  onConfirm={handleConfirm}
  onCancel={handleCancel}
  type="warning"
  showLogo={true}
/>
```

## Uso en Módulos Existentes

### Migración del PanelSubAdmin
El `PanelSubAdmin` ya ha sido migrado para usar estos componentes:

```jsx
// Antes
<Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
  <NavbarSubAdmin />
  <Box sx={{ p: { xs: 2, md: 3 } }}>
    {/* Header manual */}
    <Box sx={{ mb: 3, display: 'flex', ... }}>
      <Typography variant="h4">Panel de Sub Administrador</Typography>
      <Button onClick={handleRefresh}>Actualizar</Button>
    </Box>
    {/* Resto del contenido */}
  </Box>
</Box>

// Después
<SubAdminLayout>
  <SubAdminHeader
    title="Panel de Sub Administrador"
    subtitle="Gestión integral de usuarios y registros del sistema"
    refreshing={loading}
    onRefresh={handleRefresh}
    showAddButton={false}
    icon={InfoIcon}
    iconColor="#1976d2"
    gradientColors={["#1976d2", "#1565c0"]}
  />
  {/* Resto del contenido */}
</SubAdminLayout>
```

## Personalización

### Colores y Estilos
Cada componente acepta props para personalizar colores y estilos:

```jsx
<SubAdminHeader
  iconColor="#e91e63"
  gradientColors={["#e91e63", "#c2185b"]}
/>

<SubAdminTable
  iconColor="#4caf50"
  gradientColors={["#e8f5e8", "#c8e6c9"]}
/>
```

### Iconos
Puedes usar cualquier icono de Material-UI:

```jsx
import {
  Person as PersonIcon,
  Work as WorkIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

<SubAdminHeader icon={PersonIcon} />
<SubAdminTable icon={WorkIcon} />
```

### Acciones Personalizadas
Para la tabla, puedes agregar acciones personalizadas:

```jsx
const customActions = [
  {
    icon: <CustomIcon />,
    tooltip: 'Acción personalizada',
    color: '#ff9800',
    onClick: (row) => handleCustomAction(row)
  }
];

<SubAdminTable
  customActions={customActions}
  // ... otras props
/>
```

## Beneficios

1. **Consistencia Visual**: Todos los módulos mantienen el mismo diseño y estilo
2. **Reutilización**: No necesitas recrear el mismo diseño en cada módulo
3. **Mantenibilidad**: Cambios en el diseño se aplican automáticamente a todos los módulos
4. **Flexibilidad**: Cada componente es altamente personalizable
5. **Separación de Responsabilidades**: Cada componente tiene una función específica

## Ejemplo Completo

Ver `ExampleUsage.jsx` para un ejemplo completo de cómo usar todos los componentes juntos.

## Migración de Módulos Existentes

Para migrar un módulo existente:

1. Reemplazar el contenedor principal con `SubAdminLayout`
2. Reemplazar el header manual con `SubAdminHeader`
3. Reemplazar las tablas manuales con `SubAdminTable`
4. Reemplazar las alertas manuales con los componentes de `SubAdminAlerts`
5. Ajustar las props según sea necesario

Esto mantendrá la funcionalidad existente mientras se mejora la consistencia visual y la mantenibilidad del código.
