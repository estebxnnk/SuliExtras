import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Chip
} from '@mui/material';
import {
  SubAdminLayout,
  SubAdminHeader,
  SubAdminTable,
  SubAdminUniversalAlert,
  SubAdminConfirmDialog
} from './index';
import {
  Person as PersonIcon,
  Work as WorkIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';

// Ejemplo de uso de todos los componentes reutilizables
const ExampleUsage = () => {
  const [alertState, setAlertState] = useState({
    open: false,
    type: 'info',
    message: '',
    title: ''
  });
  
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: null
  });

  // Datos de ejemplo para la tabla
  const exampleData = [
    {
      id: 1,
      nombre: 'Juan Pérez',
      email: 'juan@ejemplo.com',
      rol: 'Empleado',
      estado: 'Activo',
      fechaCreacion: '2024-01-15'
    },
    {
      id: 2,
      nombre: 'María García',
      email: 'maria@ejemplo.com',
      rol: 'Jefe Directo',
      estado: 'Activo',
      fechaCreacion: '2024-01-10'
    }
  ];

  // Columnas de ejemplo para la tabla
  const columns = [
    {
      id: 'nombre',
      label: 'Nombre',
      render: (value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2' }}>
            {value.charAt(0)}
          </Avatar>
          {value}
        </Box>
      )
    },
    {
      id: 'email',
      label: 'Email'
    },
    {
      id: 'rol',
      label: 'Rol',
      render: (value) => (
        <Chip 
          label={value} 
          size="small" 
          color={value === 'Empleado' ? 'primary' : 'secondary'}
        />
      )
    },
    {
      id: 'estado',
      label: 'Estado',
      render: (value) => (
        <Chip 
          label={value} 
          size="small" 
          color={value === 'Activo' ? 'success' : 'warning'}
        />
      )
    },
    {
      id: 'fechaCreacion',
      label: 'Fecha de Creación',
      render: (value) => new Date(value).toLocaleDateString('es-ES')
    }
  ];

  // Funciones de ejemplo
  const handleRefresh = () => {
    setAlertState({
      open: true,
      type: 'success',
      message: 'Datos actualizados correctamente',
      title: 'Éxito'
    });
  };

  const handleAdd = () => {
    setAlertState({
      open: true,
      type: 'info',
      message: 'Funcionalidad de agregar usuario',
      title: 'Información'
    });
  };

  const handleView = (row) => {
    setAlertState({
      open: true,
      type: 'info',
      message: `Viendo detalles de: ${row.nombre}`,
      title: 'Ver Usuario'
    });
  };

  const handleEdit = (row) => {
    setAlertState({
      open: true,
      type: 'warning',
      message: `Editando usuario: ${row.nombre}`,
      title: 'Editar Usuario'
    });
  };

  const handleDelete = (row) => {
    setConfirmDialog({
      open: true,
      title: 'Confirmar Eliminación',
      message: `¿Estás seguro de que deseas eliminar a ${row.nombre}?`,
      onConfirm: () => {
        setAlertState({
          open: true,
          type: 'success',
          message: `${row.nombre} ha sido eliminado`,
          title: 'Usuario Eliminado'
        });
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    });
  };

  const hideAlert = () => {
    setAlertState({ ...alertState, open: false });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({ ...confirmDialog, open: false });
  };

  return (
    <SubAdminLayout>
      {/* Header reutilizable */}
      <SubAdminHeader
        title="Ejemplo de Uso"
        subtitle="Demostración de componentes reutilizables del SubAdministrador"
        refreshing={false}
        onRefresh={handleRefresh}
        onAdd={handleAdd}
        addButtonText="Agregar Usuario"
        icon={PersonIcon}
        iconColor="#1976d2"
        gradientColors={["#1976d2", "#1565c0"]}
      >
        {/* Contenido adicional del header */}
        <Box sx={{ 
          p: 2, 
          bgcolor: 'rgba(25, 118, 210, 0.1)', 
          borderRadius: 2,
          border: '1px solid rgba(25, 118, 210, 0.2)'
        }}>
          <Typography variant="body2" color="primary">
            Este es un ejemplo de cómo usar los componentes reutilizables del SubAdministrador.
            Puedes personalizar cada componente según tus necesidades específicas.
          </Typography>
        </Box>
      </SubAdminHeader>

      {/* Tabla reutilizable */}
      <SubAdminTable
        data={exampleData}
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
        showPagination={false}
        emptyMessage="No hay usuarios para mostrar"
      >
        {/* Contenido adicional antes de la tabla */}
        <Box sx={{ 
          p: 2, 
          bgcolor: 'rgba(76, 175, 80, 0.1)', 
          borderRadius: 2,
          border: '1px solid rgba(76, 175, 80, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <WorkIcon color="success" />
          <Typography variant="body2" color="success.main">
            Total de usuarios: {exampleData.length}
          </Typography>
        </Box>
      </SubAdminTable>

      {/* Alerta universal reutilizable */}
      <SubAdminUniversalAlert
        open={alertState.open}
        type={alertState.type}
        message={alertState.message}
        title={alertState.title}
        onClose={hideAlert}
        showLogo={true}
        autoHideDuration={4000}
      />

      {/* Diálogo de confirmación reutilizable */}
      <SubAdminConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDialog.onConfirm}
        onCancel={closeConfirmDialog}
        type="warning"
        showLogo={true}
      />
    </SubAdminLayout>
  );
};

export default ExampleUsage;
