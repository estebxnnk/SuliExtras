import React from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Avatar,
  Chip,
  Divider
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';

const SubAdminHeader = ({
  title = "Módulo SubAdministrador",
  subtitle = "Panel de gestión administrativa",
  refreshing = false,
  onRefresh,
  onAdd,
  addButtonText = "Agregar Nuevo",
  showAddButton = true,
  showRefreshButton = true,
  showSettingsButton = false,
  onSettings,
  icon: Icon = DashboardIcon,
  iconColor = "#1976d2",
  gradientColors = ["#1976d2", "#1565c0"],
  children
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      {/* Header Principal */}
      <Box sx={{
        background: `linear-gradient(135deg, ${gradientColors[0]}, ${gradientColors[1]})`,
        borderRadius: 3,
        p: 3,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          pointerEvents: 'none'
        }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, position: 'relative', zIndex: 1 }}>
          <Avatar sx={{ 
            bgcolor: 'rgba(255,255,255,0.2)', 
            color: 'white',
            width: 56,
            height: 56
          }}>
            <Icon sx={{ fontSize: 28 }} />
          </Avatar>
          
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
              {subtitle}
            </Typography>
          </Box>

          {/* Botones de Acción */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {showRefreshButton && (
              <Tooltip title="Actualizar datos">
                <IconButton
                  onClick={onRefresh}
                  disabled={refreshing}
                  sx={{
                    color: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                    '&:disabled': { opacity: 0.6 }
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            )}

            {showSettingsButton && onSettings && (
              <Tooltip title="Configuración">
                <IconButton
                  onClick={onSettings}
                  sx={{
                    color: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                  }}
                >
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
            )}

            {showAddButton && onAdd && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={onAdd}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.3)',
                    borderColor: 'rgba(255,255,255,0.5)'
                  }
                }}
              >
                {addButtonText}
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      {/* Contenido adicional del header */}
      {children && (
        <>
          <Divider sx={{ my: 2 }} />
          {children}
        </>
      )}
    </Box>
  );
};

export default SubAdminHeader;
