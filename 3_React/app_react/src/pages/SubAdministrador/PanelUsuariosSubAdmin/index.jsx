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
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import NavbarSubAdmin from '../NavbarSubAdmin';
import { usePanelUsuariosSubAdmin } from './hooks/usePanelUsuariosSubAdmin';
import { UsuariosTable } from './components/UsuariosTable';
import { UsuarioDialog } from './components/UsuarioDialog';
import { FiltrosUsuarios } from './components/FiltrosUsuarios';
import LoadingSpinner from './components/LoadingSpinner';

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
      <Box sx={{ 
        minHeight: '100vh', 
        width: '100vw', 
        background: "url('/img/Recepcion.jpg') no-repeat center center", 
        backgroundSize: 'cover',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <LoadingSpinner message="Cargando usuarios..." size="large" />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      width: '100vw', 
      background: "url('/img/Recepcion.jpg') no-repeat center center", 
      backgroundSize: 'cover',
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      <NavbarSubAdmin />
      
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {/* Header */}
        <Paper elevation={8} sx={{ 
          p: 4, 
          mb: 4, 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(240,248,255,0.98) 100%)',
          border: '1px solid rgba(25, 118, 210, 0.2)',
          borderRadius: 4,
          backdropFilter: 'blur(10px)'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PersonIcon sx={{ fontSize: 48, color: '#1976d2' }} />
              <Box>
                <Typography variant="h3" component="h1" fontWeight={800} color="#1976d2" sx={{ 
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Gestión de Usuarios
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1, fontWeight: 500 }}>
                  Administra y gestiona todos los usuarios del sistema
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddCircleIcon />}
              onClick={() => navigate('/registrar-usuario')}
              sx={{ 
                minWidth: 'auto',
                px: 4,
                py: 2,
                fontWeight: 700,
                fontSize: '1.1rem',
                borderRadius: 3,
                background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Registrar Usuario
            </Button>
          </Box>
        </Paper>

        {/* Filtros */}
        <Paper elevation={3} sx={{ 
          p: 3, 
          mb: 3, 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,248,255,0.95) 100%)',
          border: '1px solid rgba(25, 118, 210, 0.2)',
          borderRadius: 3,
          backdropFilter: 'blur(5px)'
        }}>
          <FiltrosUsuarios
            search={search}
            onSearchChange={setSearch}
            isMobile={isMobile}
          />
        </Paper>

        {/* Tabla de Usuarios */}
        <Paper elevation={3} sx={{ 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,248,255,0.95) 100%)',
          border: '1px solid rgba(25, 118, 210, 0.2)',
          borderRadius: 3,
          backdropFilter: 'blur(5px)'
        }}>
          <UsuariosTable
            usuarios={usuarios}
            search={search}
            onVer={handleVer}
            onEditar={handleEditar}
            onEliminar={handleEliminar}
            onCambiarRol={handleCambiarRol}
            isMobile={isMobile}
          />
        </Paper>

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
          <Paper elevation={2} sx={{ 
            mt: 3, 
            p: 3, 
            background: mensaje.includes('exitosamente') 
              ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)'
              : 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%)',
            border: `2px solid ${mensaje.includes('exitosamente') ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'}`,
            borderRadius: 3,
            textAlign: 'center'
          }}>
            <Typography 
              variant="h6" 
              color={mensaje.includes('exitosamente') ? 'success.main' : 'error.main'}
              sx={{ 
                fontWeight: 600,
                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              {mensaje}
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
}

export default PanelUsuariosSubAdmin; 