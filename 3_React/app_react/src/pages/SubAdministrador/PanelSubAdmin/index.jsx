import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
  Chip,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import RefreshIcon from '@mui/icons-material/Refresh';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import NavbarSubAdmin from '../NavbarSubAdmin';
import { usePanelSubAdmin } from './hooks/usePanelSubAdmin';
import { UsuarioDialog } from './components/UsuarioDialog';
import { FiltrosPanel } from './components/FiltrosPanel';
import { KPICards } from './components/KPICards';
import { UsuariosTable } from './components/UsuariosTable';
import { GraficoUsuarios } from './components/GraficoUsuarios';

function PanelSubAdmin() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const {
    // Estados
    usuarios,
    roles,
    registros,
    loading,
    rolFiltro,
    datePreset,
    lastUpdate,
    modalUsuario,
    
    // Setters
    setRolFiltro,
    setDatePreset,
    
    // Funciones
    fetchData,
    handleFiltroRol,
    handleOpenUsuario,
    handleCloseUsuario,
    handleRefresh
  } = usePanelSubAdmin();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Cargando...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <NavbarSubAdmin />
      
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', width: '100vw', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
            Panel de Sub Administrador
          </Typography>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{ minWidth: 'auto' }}
          >
            Actualizar
          </Button>
        </Box>

        {/* Filtros */}
        <FiltrosPanel
          rolFiltro={rolFiltro}
          datePreset={datePreset}
          roles={roles}
          onRolChange={handleFiltroRol}
          onDatePresetChange={setDatePreset}
          isMobile={isMobile}
        />

        {/* KPIs */}
        <KPICards
          usuarios={usuarios}
          registros={registros}
          datePreset={datePreset}
          isMobile={isMobile}
        />

        {/* Gráfico y Tabla */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} lg={6}>
            <GraficoUsuarios usuarios={usuarios} isMobile={isMobile} />
          </Grid>
          <Grid item xs={12} lg={6}>
            <UsuariosTable
              usuarios={usuarios}
              rolFiltro={rolFiltro}
              datePreset={datePreset}
              onVerUsuario={handleOpenUsuario}
              isMobile={isMobile}
            />
          </Grid>
        </Grid>

        {/* Diálogo de Usuario */}
        <UsuarioDialog
          open={modalUsuario.open}
          usuario={modalUsuario.usuario}
          registros={modalUsuario.registros}
          onClose={handleCloseUsuario}
          isMobile={isMobile}
        />
      </Box>
    </Box>
  );
}

export default PanelSubAdmin; 