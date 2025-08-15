import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TablePagination,
  useTheme,
  useMediaQuery
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LoadingSpinner from './components/LoadingSpinner';
import Filtros from './components/Filtros';
import UsuariosTable from './components/UsuariosTable';
import { useGestionReportes } from './hooks/useGestionReportes';
import NavbarSubAdmin from '../NavbarSubAdmin';

function GestionReportesHorasExtra() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const {
    // Estados
    usuarios,
    loading,
    search,
    page,
    rowsPerPage,
    openDialog,
    openRegistros,
    openReporte,
    openSalario,
    usuarioSeleccionado,
    registros,
    loadingRegistros,
    reporteData,
    salarioMinimo,
    
    // Setters
    setSearch,
    
    // Funciones
    fetchUsuarios,
    handleVerDetalles,
    handleVerRegistros,
    handleVerReporte,
    handleDescargarWord,
    handleDescargarExcel,
    handleChangePage,
    handleChangeRowsPerPage,
    handleCloseDialog,
    handleCloseRegistros,
    handleCloseReporte,
    handleCloseSalario,
    
    // Datos procesados
    usuariosFiltrados,
    usuariosPagina
  } = useGestionReportes();

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
        <LoadingSpinner message="Cargando módulo de reportes..." size="large" />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      Height: '100vh', 
      width: '100vw',
      overflow: 'hidden', 
      background: "url('/img/Recepcion.jpg') no-repeat center center", 
      backgroundSize: 'cover',
      display: 'flex', 
      flexDirection: 'column'
    }}>
      <NavbarSubAdmin />
      
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        pt: '120px',
        pb: '40px',
        px: { xs: 2, sm: 3, md: 4 }
      }}>
        <Paper elevation={8} sx={{ 
          borderRadius: 4, 
          p: { xs: 2, sm: 3, md: 4 },
          background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(240,248,255,0.98) 100%)',
          border: '1px solid rgba(25, 118, 210, 0.2)',
          position: 'relative',
          backdropFilter: 'blur(10px)',
          width: '100%',
          maxWidth: '95vw',
          minHeight: 'calc(100vh - 200px)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <PersonIcon sx={{ fontSize: 48, color: '#1976d2' }} />
            <Box>
              <Typography variant="h3" component="h1" fontWeight={800} color="#1976d2" sx={{ 
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Gestión de Reportes de Horas Extra
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1, fontWeight: 500 }}>
                Genera reportes detallados de horas extra para todos los usuarios del sistema
              </Typography>
            </Box>
          </Box>

          {/* Filtros */}
          <Filtros
            search={search}
            onSearchChange={setSearch}
            isMobile={isMobile}
          />

          {/* Tabla de Usuarios */}
          <UsuariosTable
            usuarios={usuariosPagina}
            search={search}
            onVer={handleVerDetalles}
            onVerRegistros={handleVerRegistros}
            onVerReporte={handleVerReporte}
            isMobile={isMobile}
          />

          {/* Paginación */}
          <Paper elevation={2} sx={{ 
            mt: 3, 
            borderRadius: 2, 
            background: 'rgba(255,255,255,0.9)',
            border: '1px solid rgba(25, 118, 210, 0.1)'
          }}>
            <TablePagination
              component="div"
              count={usuariosFiltrados.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Filas por página"
              rowsPerPageOptions={[5, 10, 25, 50]}
              sx={{
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  fontWeight: 600,
                  color: '#1976d2'
                },
                '& .MuiTablePagination-select': {
                  borderRadius: 1,
                  '&:focus': {
                    background: 'rgba(25, 118, 210, 0.1)'
                  }
                }
              }}
            />
          </Paper>
        </Paper>
      </Box>

      {/* Diálogos y componentes adicionales se pueden agregar aquí */}
    </Box>
  );
}

export default GestionReportesHorasExtra;
