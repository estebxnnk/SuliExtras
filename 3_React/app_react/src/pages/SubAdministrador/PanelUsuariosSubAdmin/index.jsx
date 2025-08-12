import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useNavigate } from 'react-router-dom';
import NavbarSubAdmin from '../NavbarSubAdmin';
import { usePanelUsuariosSubAdmin } from './hooks/usePanelUsuariosSubAdmin';
import { UsuariosTable } from './components/UsuariosTable';
import { UsuarioDialog } from './components/UsuarioDialog';
import { FiltrosUsuarios } from './components/FiltrosUsuarios';

function PanelUsuariosSubAdmin() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  const {
    // Estados
    usuarios,
    roles,
    loading,
    mensaje,
    openDialog,
    usuarioSeleccionado,
    modo,
    editData,
    nuevoRolId,
    search,
    
    // Setters
    setMensaje,
    setSearch,
    
    // Funciones
    fetchUsuarios,
    fetchRoles,
    handleVer,
    handleEditar,
    handleEliminar,
    handleGuardarEdicion,
    handleCambiarRol,
    handleGuardarRol,
    handleCloseDialog
  } = usePanelUsuariosSubAdmin();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Cargando...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <NavbarSubAdmin />
      
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
            Gestión de Usuarios
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddCircleIcon />}
            onClick={() => navigate('/registrar-usuario-sub-admin')}
            sx={{ minWidth: 'auto' }}
          >
            Registrar Usuario
          </Button>
        </Box>

        {/* Filtros */}
        <FiltrosUsuarios
          search={search}
          onSearchChange={setSearch}
          isMobile={isMobile}
        />

        {/* Tabla de Usuarios */}
        <UsuariosTable
          usuarios={usuarios}
          search={search}
          onVer={handleVer}
          onEditar={handleEditar}
          onEliminar={handleEliminar}
          onCambiarRol={handleCambiarRol}
          isMobile={isMobile}
        />

        {/* Diálogo de Usuario */}
        <UsuarioDialog
          open={openDialog}
          modo={modo}
          usuario={usuarioSeleccionado}
          editData={editData}
          nuevoRolId={nuevoRolId}
          roles={roles}
          onClose={handleCloseDialog}
          onGuardarEdicion={handleGuardarEdicion}
          onGuardarRol={handleGuardarRol}
          isMobile={isMobile}
        />

        {/* Mensaje de estado */}
        {mensaje && (
          <Box sx={{ mt: 2 }}>
            <Typography 
              variant="body2" 
              color={mensaje.includes('exitosamente') ? 'success.main' : 'error.main'}
              sx={{ textAlign: 'center' }}
            >
              {mensaje}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default PanelUsuariosSubAdmin; 