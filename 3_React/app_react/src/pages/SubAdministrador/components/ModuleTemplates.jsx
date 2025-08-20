import React, { useState } from 'react';
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
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Add as AddIcon
} from '@mui/icons-material';

// Plantilla para módulo de gestión de usuarios
export const UserManagementTemplate = () => {
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

  const handleRefresh = () => {
    setAlertState({
      open: true,
      type: 'success',
      message: 'Lista de usuarios actualizada',
      title: 'Éxito'
    });
  };

  const handleAdd = () => {
    setAlertState({
      open: true,
      type: 'info',
      message: 'Abriendo formulario de nuevo usuario',
      title: 'Agregar Usuario'
    });
  };

  const handleView = (user) => {
    setAlertState({
      open: true,
      type: 'info',
      message: `Viendo detalles de: ${user.nombre}`,
      title: 'Ver Usuario'
    });
  };

  const handleEdit = (user) => {
    setAlertState({
      open: true,
      type: 'warning',
      message: `Editando usuario: ${user.nombre}`,
      title: 'Editar Usuario'
    });
  };

  const handleDelete = (user) => {
    setConfirmDialog({
      open: true,
      title: 'Confirmar Eliminación',
      message: `¿Estás seguro de que deseas eliminar a ${user.nombre}?`,
      onConfirm: () => {
        setAlertState({
          open: true,
          type: 'success',
          message: `${user.nombre} ha sido eliminado`,
          title: 'Usuario Eliminado'
        });
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    });
  };

  const hideAlert = () => setAlertState({ ...alertState, open: false });
  const closeConfirmDialog = () => setConfirmDialog({ ...confirmDialog, open: false });

  const users = [
    { id: 1, nombre: 'Juan Pérez', email: 'juan@ejemplo.com', rol: 'Empleado', estado: 'Activo' },
    { id: 2, nombre: 'María García', email: 'maria@ejemplo.com', rol: 'Jefe Directo', estado: 'Activo' }
  ];

  const columns = [
    { id: 'nombre', label: 'Nombre' },
    { id: 'email', label: 'Email' },
    { id: 'rol', label: 'Rol' },
    { id: 'estado', label: 'Estado' }
  ];

  return (
    <SubAdminLayout>
      <SubAdminHeader
        title="Gestión de Usuarios"
        subtitle="Administra los usuarios del sistema"
        refreshing={false}
        onRefresh={handleRefresh}
        onAdd={handleAdd}
        addButtonText="Nuevo Usuario"
        icon={PersonIcon}
        iconColor="#1976d2"
        gradientColors={["#1976d2", "#1565c0"]}
      />

      <SubAdminTable
        data={users}
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
        emptyMessage="No hay usuarios registrados"
      />

      <SubAdminUniversalAlert
        open={alertState.open}
        type={alertState.type}
        message={alertState.message}
        title={alertState.title}
        onClose={hideAlert}
        showLogo={true}
      />

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

// Plantilla para módulo de reportes
export const ReportsTemplate = () => {
  const [alertState, setAlertState] = useState({
    open: false,
    type: 'info',
    message: '',
    title: ''
  });

  const handleRefresh = () => {
    setAlertState({
      open: true,
      type: 'success',
      message: 'Reportes actualizados',
      title: 'Éxito'
    });
  };

  const handleSettings = () => {
    setAlertState({
      open: true,
      type: 'info',
      message: 'Abriendo configuración de reportes',
      title: 'Configuración'
    });
  };

  const hideAlert = () => setAlertState({ ...alertState, open: false });

  return (
    <SubAdminLayout>
      <SubAdminHeader
        title="Reportes del Sistema"
        subtitle="Genera y visualiza reportes detallados"
        refreshing={false}
        onRefresh={handleRefresh}
        showAddButton={false}
        showSettingsButton={true}
        onSettings={handleSettings}
        icon={AssessmentIcon}
        iconColor="#9c27b0"
        gradientColors={["#9c27b0", "#7b1fa2"]}
      >
        {/* Contenido adicional del header */}
        <div style={{ 
          padding: '16px', 
          backgroundColor: 'rgba(156, 39, 176, 0.1)', 
          borderRadius: '8px',
          border: '1px solid rgba(156, 39, 176, 0.2)'
        }}>
          <p style={{ margin: 0, color: '#9c27b0', fontSize: '14px' }}>
            Selecciona los parámetros para generar reportes personalizados
          </p>
        </div>
      </SubAdminHeader>

      {/* Aquí iría el contenido del módulo de reportes */}
      <div style={{ 
        padding: '24px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        textAlign: 'center',
        color: '#6c757d'
      }}>
        <AssessmentIcon style={{ fontSize: '48px', marginBottom: '16px' }} />
        <h3>Contenido del Módulo de Reportes</h3>
        <p>Aquí puedes agregar filtros, gráficos y tablas de reportes</p>
      </div>

      <SubAdminUniversalAlert
        open={alertState.open}
        type={alertState.type}
        message={alertState.message}
        title={alertState.title}
        onClose={hideAlert}
        showLogo={true}
      />
    </SubAdminLayout>
  );
};

// Plantilla para módulo de configuración
export const SettingsTemplate = () => {
  const [alertState, setAlertState] = useState({
    open: false,
    type: 'info',
    message: '',
    title: ''
  });

  const handleSave = () => {
    setAlertState({
      open: true,
      type: 'success',
      message: 'Configuración guardada exitosamente',
      title: 'Éxito'
    });
  };

  const hideAlert = () => setAlertState({ ...alertState, open: false });

  return (
    <SubAdminLayout>
      <SubAdminHeader
        title="Configuración del Sistema"
        subtitle="Personaliza la configuración del módulo"
        refreshing={false}
        showAddButton={false}
        showRefreshButton={false}
        icon={SettingsIcon}
        iconColor="#ed6c02"
        gradientColors={["#ed6c02", "#e65100"]}
      />

      {/* Aquí iría el contenido del módulo de configuración */}
      <div style={{ 
        padding: '24px', 
        backgroundColor: '#fff3e0', 
        borderRadius: '8px',
        textAlign: 'center',
        color: '#856404'
      }}>
        <SettingsIcon style={{ fontSize: '48px', marginBottom: '16px' }} />
        <h3>Configuración del Sistema</h3>
        <p>Aquí puedes agregar formularios de configuración</p>
        <button 
          onClick={handleSave}
          style={{
            padding: '12px 24px',
            backgroundColor: '#ed6c02',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Guardar Configuración
        </button>
      </div>

      <SubAdminUniversalAlert
        open={alertState.open}
        type={alertState.type}
        message={alertState.message}
        title={alertState.title}
        onClose={hideAlert}
        showLogo={true}
      />
    </SubAdminLayout>
  );
};

// Plantilla para módulo de trabajo/horas extra
export const WorkManagementTemplate = () => {
  const [alertState, setAlertState] = useState({
    open: false,
    type: 'info',
    message: '',
    title: ''
  });

  const handleRefresh = () => {
    setAlertState({
      open: true,
      type: 'success',
      message: 'Datos de trabajo actualizados',
      title: 'Éxito'
    });
  };

  const handleAdd = () => {
    setAlertState({
      open: true,
      type: 'info',
      message: 'Abriendo formulario de nuevo registro',
      title: 'Nuevo Registro'
    });
  };

  const hideAlert = () => setAlertState({ ...alertState, open: false });

  const workRecords = [
    { id: 1, empleado: 'Juan Pérez', fecha: '2024-01-15', horas: 2, estado: 'Pendiente' },
    { id: 2, empleado: 'María García', fecha: '2024-01-15', horas: 1.5, estado: 'Aprobado' }
  ];

  const columns = [
    { id: 'empleado', label: 'Empleado' },
    { id: 'fecha', label: 'Fecha' },
    { id: 'horas', label: 'Horas Extra' },
    { id: 'estado', label: 'Estado' }
  ];

  return (
    <SubAdminLayout>
      <SubAdminHeader
        title="Gestión de Horas Extra"
        subtitle="Administra los registros de trabajo"
        refreshing={false}
        onRefresh={handleRefresh}
        onAdd={handleAdd}
        addButtonText="Nuevo Registro"
        icon={WorkIcon}
        iconColor="#2e7d32"
        gradientColors={["#2e7d32", "#1b5e20"]}
      />

      <SubAdminTable
        data={workRecords}
        columns={columns}
        title="Registros de Trabajo"
        subtitle="Lista de horas extra registradas"
        icon={WorkIcon}
        iconColor="#2e7d32"
        gradientColors={["#e8f5e8", "#c8e6c9"]}
        actions={['view', 'edit', 'delete', 'approve', 'reject']}
        showPagination={false}
        emptyMessage="No hay registros de trabajo"
      />

      <SubAdminUniversalAlert
        open={alertState.open}
        type={alertState.type}
        message={alertState.message}
        title={alertState.title}
        onClose={hideAlert}
        showLogo={true}
      />
    </SubAdminLayout>
  );
};

export default {
  UserManagementTemplate,
  ReportsTemplate,
  SettingsTemplate,
  WorkManagementTemplate
};
