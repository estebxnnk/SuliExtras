import React from 'react';
import { 
  Drawer, 
  Box, 
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Typography, 
  IconButton,
  alpha,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

function SidebarUniversal({ open, onClose, items = [], header = 'Menú', activeKey }) {
  const navigate = useNavigate();
  const theme = useTheme();
  
  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      PaperProps={{
        sx: {
          width: 320,
          borderTopRightRadius: 24,
          borderBottomRightRadius: 24,
          background: `linear-gradient(135deg, 
            ${alpha('#ffffff', 0.95)} 0%, 
            ${alpha('#f8faff', 0.95)} 50%, 
            ${alpha('#f0f4ff', 0.95)} 100%)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha('#e3f2fd', 0.3)}`,
          boxShadow: `0 24px 48px ${alpha('#000000', 0.12)}, 
                     0 8px 24px ${alpha('#1976d2', 0.08)}`,
          overflow: 'hidden'
        }
      }}
    >
      {/* Header con glassmorphism */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          p: 3,
          background: `linear-gradient(135deg, 
            ${alpha('#ffffff', 0.8)} 0%, 
            ${alpha('#f5f7ff', 0.6)} 100%)`,
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${alpha('#e3f2fd', 0.4)}`
        }}
      >
        <Box>
          <Typography 
            variant="h5" 
            fontWeight={700}
            sx={{ 
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.5px'
            }}
          >
            {header}
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              color: alpha('#666', 0.8),
              fontWeight: 500,
              mt: 0.5,
              display: 'block'
            }}
          >
            Navegación principal
          </Typography>
        </Box>
        <IconButton 
          onClick={onClose}
          sx={{
            background: alpha('#f5f5f5', 0.8),
            backdropFilter: 'blur(8px)',
            border: `1px solid ${alpha('#e0e0e0', 0.3)}`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              background: alpha('#1976d2', 0.1),
              borderColor: alpha('#1976d2', 0.3),
              transform: 'scale(1.05)',
              boxShadow: `0 4px 12px ${alpha('#1976d2', 0.2)}`
            }
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
      </Box>

      {/* Lista de navegación */}
      <List sx={{ p: 2, pt: 3 }}>
        {items.map((item, index) => {
          const isActive = item.key && item.key === activeKey;
          return (
            <ListItemButton
              key={item.key || item.label}
              onClick={() => { 
                item.onClick?.(); 
                if (item.to) navigate(item.to); 
                onClose?.(); 
              }}
              sx={{
                borderRadius: 3,
                mb: 1.5,
                px: 2,
                py: 1.5,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                
                // Estado normal
                color: isActive ? '#1976d2' : alpha('#333', 0.87),
                background: isActive 
                  ? `linear-gradient(135deg, 
                      ${alpha('#1976d2', 0.15)} 0%, 
                      ${alpha('#42a5f5', 0.08)} 100%)`
                  : 'transparent',
                
                // Borde y sombra
                border: isActive 
                  ? `1px solid ${alpha('#1976d2', 0.3)}`
                  : `1px solid ${alpha('#e0e0e0', 0.2)}`,
                boxShadow: isActive 
                  ? `0 8px 24px ${alpha('#1976d2', 0.15)}, 
                     0 2px 8px ${alpha('#1976d2', 0.1)}`
                  : 'none',
                
                // Pseudo-elemento para efecto de brillo
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: `linear-gradient(90deg, 
                    transparent, 
                    ${alpha('#ffffff', 0.4)}, 
                    transparent)`,
                  transition: 'left 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                },
                
                // Estados hover y focus
                '&:hover': {
                  background: isActive 
                    ? `linear-gradient(135deg, 
                        ${alpha('#1976d2', 0.2)} 0%, 
                        ${alpha('#42a5f5', 0.12)} 100%)`
                    : `linear-gradient(135deg, 
                        ${alpha('#f5f5f5', 0.8)} 0%, 
                        ${alpha('#e3f2fd', 0.4)} 100%)`,
                  borderColor: alpha('#1976d2', 0.4),
                  transform: 'translateY(-2px)',
                  boxShadow: isActive 
                    ? `0 12px 32px ${alpha('#1976d2', 0.2)}, 
                       0 4px 12px ${alpha('#1976d2', 0.15)}`
                    : `0 8px 24px ${alpha('#000', 0.08)}, 
                       0 2px 8px ${alpha('#1976d2', 0.1)}`,
                  
                  '&::before': {
                    left: '100%'
                  }
                },
                
                '&:active': {
                  transform: 'translateY(0px) scale(0.98)',
                }
              }}
            >
              {item.icon && (
                <ListItemIcon 
                  sx={{ 
                    minWidth: 48,
                    color: isActive ? '#1976d2' : alpha('#666', 0.8),
                    '& .MuiSvgIcon-root': {
                      fontSize: '1.4rem',
                      filter: isActive 
                        ? `drop-shadow(0 2px 4px ${alpha('#1976d2', 0.3)})`
                        : 'none',
                      transition: 'all 0.3s ease'
                    }
                  }}
                >
                  {item.icon}
                </ListItemIcon>
              )}
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.95rem',
                  letterSpacing: '0.2px'
                }}
              />
              
              {/* Indicador activo */}
              {isActive && (
                <Box
                  sx={{
                    width: 4,
                    height: 24,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
                    boxShadow: `0 2px 8px ${alpha('#1976d2', 0.4)}`,
                    animation: 'pulse 2s infinite'
                  }}
                />
              )}
            </ListItemButton>
          );
        })}
      </List>

      {/* Footer decorativo */}
      <Box
        sx={{
          mt: 'auto',
          p: 2,
          background: `linear-gradient(135deg, 
            ${alpha('#f8faff', 0.6)} 0%, 
            ${alpha('#e3f2fd', 0.4)} 100%)`,
          borderTop: `1px solid ${alpha('#e3f2fd', 0.3)}`
        }}
      >
        <Typography 
          variant="caption" 
          sx={{ 
            color: alpha('#666', 0.6),
            textAlign: 'center',
            display: 'block',
            fontWeight: 500
          }}
        >
          Diseño moderno v2.0
        </Typography>
      </Box>

      {/* CSS para la animación */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </Drawer>
  );
}

export default SidebarUniversal;