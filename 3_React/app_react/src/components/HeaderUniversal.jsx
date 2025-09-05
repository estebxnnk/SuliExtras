import React from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Add as AddIcon
} from '@mui/icons-material';

/**
 * Header universal que se basa 100% en el estilo de HeaderGestionRegistros
 * Mantiene la misma estética visual y estructura
 */
const HeaderUniversal = ({ 
  // Propiedades básicas
  title = "Título del Módulo",
  subtitle = "Descripción del módulo",
  icon: Icon = null,
  iconColor = "#1976d2",
  
  // Estado de refrescado
  refreshing = false,
  onRefresh,
  
  // Búsqueda
  showSearch = false,
  searchValue = "",
  searchPlaceholder = "Buscar...",
  onSearchChange,
  
  // Botón de agregar
  showAddButton = false,
  addButtonText = "Agregar",
  onAdd,
  
  // Botones adicionales
  additionalButtons = [],
  
  // Estadísticas
  showStats = false,
  stats = []
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
      {/* Icono del módulo */}
      {Icon && (
        <Icon sx={{ fontSize: 48, color: iconColor }} />
      )}
      
      {/* Contenido principal */}
      <Box sx={{ flex: 1 }}>
        {/* Título con el mismo estilo */}
        <Typography variant="h3" component="h1" fontWeight={800} color={iconColor} sx={{ 
          textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          background: `linear-gradient(135deg, ${iconColor} 0%, ${iconColor}dd 100%)`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {title}
        </Typography>
        
        {/* Subtítulo */}
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1, fontWeight: 500 }}>
          {subtitle}
        </Typography>
        
        {/* Estadísticas si están habilitadas */}
        {showStats && stats.length > 0 && (
          <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
            {stats.map((stat, index) => (
              <Box key={index} sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                p: 1,
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.8)',
                border: `1px solid ${iconColor}20`
              }}>
                <Typography variant="h6" fontWeight={700} color={iconColor}>
                  {stat.value}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
      
      {/* Campo de búsqueda si está habilitado */}
      {showSearch && (
        <TextField
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={onSearchChange}
          size="small"
          sx={{ 
            minWidth: 300,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.9)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,1)'
              }
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: iconColor }} />
              </InputAdornment>
            ),
          }}
        />
      )}
      
      {/* Botones de acción */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Botón de agregar */}
        {showAddButton && onAdd && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAdd}
            sx={{ 
              fontWeight: 700,
              borderRadius: 2,
              background: `linear-gradient(135deg, #4caf50 0%, #45a049 100%)`,
              boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)'
              }
            }}
          >
            {addButtonText}
          </Button>
        )}
        
        {/* Botones adicionales */}
        {additionalButtons.map((button, index) => (
          <Box key={index}>
            {button}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default HeaderUniversal;
