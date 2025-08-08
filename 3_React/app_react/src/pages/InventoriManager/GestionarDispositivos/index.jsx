import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Fab,
  Tooltip,
  Snackbar,
  Alert,
  Skeleton,
  Card,
  CardContent,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

// Importar el hook personalizado
import { useDispositivos } from './hooks/useDispositivos';

// Importar utilidades
import { filtrarDispositivos, paginarDispositivos } from './utils/dispositivosUtils';

// Importar componentes
import NavbarInventoryManager from '../NavbarInventoryManager';
import Filtros from './components/Filtros';
import DispositivoTable from './components/DispositivoTable';
import DispositivoDialog from './components/DispositivoDialog';
import ViewDialog from './components/ViewDialog';
import AsignacionesDialog from '../components/AsignacionesDialog';

function GestionarDispositivos() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Usar el hook personalizado
  const {
    // Estados
    dispositivos,
    sedes,
    empleados,
    loading,
    submitting,
    openDialog,
    openViewDialog,
    editingDispositivo,
    viewingDispositivo,
    snackbar,
    openAsignacionesDialog,
    selectedDispositivoAsignaciones,
    asignaciones,
    loadingAsignaciones,
    page,
    rowsPerPage,
    filters,
    showFilters,
    searchTerm,
    formData,
    
    // Setters
    setSnackbar,
    setShowFilters,
    setFilters,
    setSearchTerm,
    setFormData,
    setPage,
    
    // Funciones
    fetchData,
    handleSubmit,
    handleDelete,
    handleOpenDialog,
    handleOpenViewDialog,
    handleCloseDialog,
    handleOpenAsignacionesDialog,
    handleCloseAsignacionesDialog,
    handleChangePage,
    handleChangeRowsPerPage,
    clearFilters
  } = useDispositivos();

  // Filtrar y paginar dispositivos
  const filteredDispositivos = filtrarDispositivos(dispositivos, searchTerm, filters);
  const paginatedDispositivos = paginarDispositivos(filteredDispositivos, page, rowsPerPage);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', pt: 12, pb: 4 }}>
      <NavbarInventoryManager />
      
      <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, sm: 3 } }}>
        {/* Header mejorado */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant={isMobile ? "h4" : "h3"} fontWeight={700} color="white" sx={{ mb: 1 }}>
            Gestión de Dispositivos
          </Typography>
          <Typography variant={isMobile ? "body1" : "h6"} color="rgba(255,255,255,0.8)" sx={{ mb: 1 }}>
            Administra el inventario de dispositivos tecnológicos
          </Typography>
          <Typography variant="body2" color="rgba(255,255,255,0.6)">
            {filteredDispositivos.length} dispositivos encontrados
          </Typography>
        </Box>

        {/* Componente de filtros */}
        <Filtros
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          loading={loading}
          fetchData={fetchData}
          clearFilters={clearFilters}
          dispositivos={dispositivos}
          sedes={sedes}
          isMobile={isMobile}
        />

        {/* Botón de nuevo dispositivo para desktop */}
        {!isMobile && (
          <Box sx={{ mb: 3, textAlign: 'right' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              size="large"
              sx={{ 
                background: 'linear-gradient(135deg, #0d47a1, #1976d2)',
                borderRadius: 3,
                boxShadow: '0 4px 16px rgba(13, 71, 161, 0.3)',
                '&:hover': { 
                  background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
                  boxShadow: '0 6px 20px rgba(13, 71, 161, 0.4)'
                }
              }}
            >
              Nuevo Dispositivo
            </Button>
          </Box>
        )}

        {/* Contenido principal */}
        {loading ? (
          <Box>
            {[...Array(3)].map((_, index) => (
              <Card key={index} sx={{ 
                mb: 2, 
                background: 'rgba(255,255,255,0.95)', 
                borderRadius: 4
              }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Skeleton variant="rectangular" height={60} />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" width="60%" />
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <DispositivoTable
            dispositivos={paginatedDispositivos}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            handleOpenViewDialog={handleOpenViewDialog}
            handleOpenDialog={handleOpenDialog}
            handleDelete={handleDelete}
            handleOpenAsignacionesDialog={handleOpenAsignacionesDialog}
            totalCount={filteredDispositivos.length} // Pasar el total de registros filtrados
          />
        )}

        {/* Dialog para agregar/editar */}
        <DispositivoDialog
          open={openDialog}
          onClose={handleCloseDialog}
          formData={formData}
          setFormData={setFormData}
          editingDispositivo={editingDispositivo}
          sedes={sedes}
          empleados={empleados}
          submitting={submitting}
          handleSubmit={handleSubmit}
          isMobile={isMobile}
        />

        {/* Dialog de vista detallada */}
        <ViewDialog
          open={openViewDialog}
          onClose={handleCloseDialog}
          dispositivo={viewingDispositivo}
          handleOpenDialog={handleOpenDialog}
          isMobile={isMobile}
        />

        {/* Dialog de asignaciones */}
        <AsignacionesDialog
          open={openAsignacionesDialog}
          onClose={handleCloseAsignacionesDialog}
          dispositivo={selectedDispositivoAsignaciones}
          asignaciones={asignaciones}
          loadingAsignaciones={loadingAsignaciones}
          isMobile={isMobile}
        />

        {/* FAB para móvil */}
        {isMobile && (
          <Tooltip title="Nuevo Dispositivo" arrow>
            <Fab
              color="primary"
              aria-label="add"
              onClick={() => handleOpenDialog()}
              sx={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                background: 'linear-gradient(135deg, #0d47a1, #1976d2)',
                boxShadow: '0 8px 24px rgba(13, 71, 161, 0.4)',
                '&:hover': { 
                  background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
                  boxShadow: '0 12px 32px rgba(13, 71, 161, 0.5)'
                }
              }}
            >
              <AddIcon />
            </Fab>
          </Tooltip>
        )}

        {/* Snackbar para notificaciones */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert 
            severity={snackbar.severity} 
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            sx={{ 
              borderRadius: 3,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

export default GestionarDispositivos; 