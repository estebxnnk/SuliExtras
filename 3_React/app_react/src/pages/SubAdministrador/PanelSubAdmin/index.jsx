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
import { InitialPageLoader } from '../../../components';
import { usePanelSubAdmin } from './hooks/usePanelSubAdmin';
import { UsuarioDialog } from './components/UsuarioDialog';
import { FiltrosPanel } from './components/FiltrosPanel';
import { KPICards } from './components/KPICards';
import { UsuariosTable } from './components/UsuariosTable';
import { GraficoUsuarios } from './components/GraficoUsuarios';
import HeaderPanelSubAdmin from './components/HeaderPanelSubAdmin';
import LayoutSubAdmin from './components/LayoutSubAdmin';

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
    return <InitialPageLoader open title="Cargando Panel" subtitle="Preparando datos y componentes" iconColor="#1976d2" />;
  }

  return (
    <LayoutSubAdmin>
      <HeaderPanelSubAdmin
        title="Panel de Sub Administrador"
        subtitle="Gestión integral de usuarios y registros del sistema"
        refreshing={loading}
        onRefresh={handleRefresh}
        showAddButton={false}
        icon={InfoIcon}
        iconColor="#1976d2"
        gradientColors={["#1976d2", "#1565c0"]}
      />

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
      </LayoutSubAdmin>
    );
}

export default PanelSubAdmin; 