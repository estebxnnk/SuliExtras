import React from 'react';
import { 
  Box, 
  IconButton, 
  Typography, 
  Avatar, 
  Menu, 
  Button, 
  Divider, 
  Paper,
  alpha,
  useTheme,
  Chip,
  Fade
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';

function NavbarUniversal({
  logoSrc = '/img/NuevoLogo.png',
  title = '',
  items = [],
  activeKey,
  activeLabel,
  onMenuToggle,
  user,
  onLogout,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();

  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'fixed',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        width: { xs: '96vw', md: '98vw' },
        maxWidth: 1400,
        height: 80,
        
        // Glassmorphism avanzado
        background: `linear-gradient(135deg, 
          ${alpha('#ffffff', 0.95)} 0%, 
          ${alpha('#f8faff', 0.92)} 50%, 
          ${alpha('#f0f4ff', 0.95)} 100%)`,
        backdropFilter: 'blur(24px)',
        
        // Bordes y sombras modernas
        border: `1px solid ${alpha('#e3f2fd', 0.4)}`,
        borderRadius: 4,
        boxShadow: `
          0 20px 40px ${alpha('#000000', 0.08)}, 
          0 8px 24px ${alpha('#1976d2', 0.06)},
          inset 0 1px 0 ${alpha('#ffffff', 0.8)}
        `,
        
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: { xs: 2.5, md: 4 },
        zIndex: 1200,
        
        // Animación de aparición
        animation: 'slideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        
        // Efecto hover sutil
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: `
            0 24px 48px ${alpha('#000000', 0.12)}, 
            0 12px 32px ${alpha('#1976d2', 0.08)},
            inset 0 1px 0 ${alpha('#ffffff', 0.9)}
          `,
          transform: 'translateX(-50%) translateY(-2px)'
        }
      }}
    >
      {/* Sección izquierda */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flex: 1 }}>
        {/* Botón menú modernizado */}
        <IconButton 
          edge="start" 
          onClick={onMenuToggle}
          sx={{
            background: `linear-gradient(135deg, 
              ${alpha('#f5f5f5', 0.8)} 0%, 
              ${alpha('#ffffff', 0.6)} 100%)`,
            backdropFilter: 'blur(8px)',
            border: `1px solid ${alpha('#e0e0e0', 0.3)}`,
            borderRadius: 2.5,
            width: 52,
            height: 52,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            
            '&:hover': {
              background: `linear-gradient(135deg, 
                ${alpha('#1976d2', 0.1)} 0%, 
                ${alpha('#42a5f5', 0.05)} 100%)`,
              borderColor: alpha('#1976d2', 0.3),
              transform: 'scale(1.08) rotate(180deg)',
              boxShadow: `0 8px 24px ${alpha('#1976d2', 0.2)}`,
            },
            
            '& .MuiSvgIcon-root': {
              fontSize: '1.4rem',
              color: alpha('#333', 0.8),
              transition: 'color 0.3s ease'
            },
            
            '&:hover .MuiSvgIcon-root': {
              color: '#1976d2'
            }
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo con efecto hover */}
        <Box 
          component="img" 
          src={logoSrc} 
          alt="Logo" 
          sx={{ 
            height: 48,
            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'scale(1.05)',
              filter: 'drop-shadow(0 4px 12px rgba(25,118,210,0.2))'
            }
          }} 
        />

        {/* Título con gradiente */}
        {title && (
          <Typography 
            variant="h5" 
            sx={{ 
              display: { xs: 'none', md: 'block' },
              fontWeight: 700,
              letterSpacing: '-0.5px',
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {title}
          </Typography>
        )}

        {/* Chip de navegación activa modernizado */}
        <Box sx={{ display: { xs: 'none', md: 'block' }, ml: 2 }}>
          <Chip
            label={activeLabel || (items.find(i => i.key === activeKey)?.label) || 'Navegación'}
            sx={{
              px: 2,
              py: 0.5,
              height: 36,
              fontWeight: 600,
              fontSize: '0.85rem',
              letterSpacing: '0.3px',
              color: '#1976d2',
              
              background: `linear-gradient(135deg, 
                ${alpha('#1976d2', 0.15)} 0%, 
                ${alpha('#42a5f5', 0.08)} 100%)`,
              
              border: `1px solid ${alpha('#1976d2', 0.25)}`,
              borderRadius: 3,
              
              boxShadow: `
                0 4px 12px ${alpha('#1976d2', 0.15)},
                inset 0 1px 0 ${alpha('#ffffff', 0.8)}
              `,
              
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              
              '&:hover': {
                background: `linear-gradient(135deg, 
                  ${alpha('#1976d2', 0.2)} 0%, 
                  ${alpha('#42a5f5', 0.12)} 100%)`,
                transform: 'translateY(-2px)',
                boxShadow: `
                  0 8px 24px ${alpha('#1976d2', 0.2)},
                  inset 0 1px 0 ${alpha('#ffffff', 0.9)}
                `
              },
              
              // Efecto de pulso sutil
              animation: 'pulse 3s ease-in-out infinite'
            }}
          />
        </Box>
      </Box>

      {/* Sección derecha - Avatar del usuario */}
      <Box>
        <IconButton 
          onClick={handleProfileClick} 
          size="large"
          sx={{
            p: 0.5,
            background: `linear-gradient(135deg, 
              ${alpha('#ffffff', 0.9)} 0%, 
              ${alpha('#f8faff', 0.8)} 100%)`,
            backdropFilter: 'blur(12px)',
            border: `2px solid ${alpha('#52AB41', 0.2)}`,
            borderRadius: 3,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            
            '&:hover': {
              transform: 'scale(1.05)',
              borderColor: alpha('#52AB41', 0.4),
              boxShadow: `
                0 8px 24px ${alpha('#52AB41', 0.2)},
                0 0 0 4px ${alpha('#52AB41', 0.1)}
              `
            }
          }}
        >
          <Avatar 
            sx={{ 
              bgcolor: '#52AB41', 
              width: 50, 
              height: 50,
              boxShadow: `inset 0 2px 4px ${alpha('#000', 0.1)}`,
              transition: 'all 0.3s ease'
            }}
          >
            <AccountCircleIcon sx={{ fontSize: 32, color: '#fff' }} />
          </Avatar>
        </IconButton>

        {/* Menu del perfil modernizado */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          TransitionComponent={Fade}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              mt: 1.5,
              ml: -0.5,
              minWidth: 280,
              borderRadius: 4,
              
              // Glassmorphism para el menú
              background: `linear-gradient(135deg, 
                ${alpha('#ffffff', 0.95)} 0%, 
                ${alpha('#f8faff', 0.95)} 100%)`,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha('#e3f2fd', 0.3)}`,
              
              boxShadow: `
                0 24px 48px ${alpha('#000000', 0.12)}, 
                0 8px 24px ${alpha('#52AB41', 0.08)}
              `,
              
              // Animación de entrada
              animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -8,
                right: 20,
                width: 16,
                height: 16,
                background: alpha('#ffffff', 0.95),
                border: `1px solid ${alpha('#e3f2fd', 0.3)}`,
                borderBottom: 'none',
                borderRight: 'none',
                transform: 'rotate(45deg)',
                backdropFilter: 'blur(20px)'
              }
            }
          }}
        >
          <Box sx={{ p: 3 }}>
            {/* Header del perfil */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: 1.5,
              mb: 2
            }}>
              <Avatar 
                sx={{ 
                  bgcolor: '#52AB41', 
                  width: 72, 
                  height: 72,
                  boxShadow: `
                    0 8px 24px ${alpha('#52AB41', 0.3)},
                    inset 0 2px 4px ${alpha('#000', 0.1)}
                  `
                }}
              >
                <PersonIcon sx={{ fontSize: 36, color: '#fff' }} />
              </Avatar>
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h6" 
                  fontWeight={700}
                  sx={{ 
                    color: '#333',
                    letterSpacing: '-0.2px'
                  }}
                >
                  {user?.name || 'Usuario'}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: alpha('#666', 0.8),
                    mt: 0.5
                  }}
                >
                  {user?.email || ''}
                </Typography>
                
                {user?.role && (
                  <Chip
                    label={user.role}
                    size="small"
                    sx={{
                      mt: 1,
                      bgcolor: alpha('#52AB41', 0.1),
                      color: '#52AB41',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      border: `1px solid ${alpha('#52AB41', 0.2)}`
                    }}
                  />
                )}
              </Box>
            </Box>

            <Divider 
              sx={{ 
                my: 2,
                background: alpha('#e0e0e0', 0.5)
              }} 
            />

            {/* Botón de cerrar sesión modernizado */}
            <Button 
              onClick={onLogout}
              fullWidth
              startIcon={<LogoutIcon />}
              sx={{
                py: 1.5,
                fontWeight: 600,
                fontSize: '0.95rem',
                borderRadius: 3,
                textTransform: 'none',
                
                background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
                color: '#fff',
                
                border: `1px solid ${alpha('#d32f2f', 0.3)}`,
                boxShadow: `
                  0 4px 12px ${alpha('#d32f2f', 0.3)},
                  inset 0 1px 0 ${alpha('#ffffff', 0.2)}
                `,
                
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                
                '&:hover': {
                  background: 'linear-gradient(135deg, #c62828 0%, #d32f2f 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: `
                    0 8px 24px ${alpha('#d32f2f', 0.4)},
                    inset 0 1px 0 ${alpha('#ffffff', 0.3)}
                  `
                },
                
                '&:active': {
                  transform: 'translateY(0) scale(0.98)'
                }
              }}
            >
              Cerrar sesión
            </Button>
          </Box>
        </Menu>
      </Box>

      {/* Estilos CSS para animaciones */}
      <style jsx>{`
        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        
        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes pulse {
          0%, 100% { 
            box-shadow: 
              0 4px 12px rgba(25,118,210,0.15),
              inset 0 1px 0 rgba(255,255,255,0.8);
          }
          50% { 
            box-shadow: 
              0 6px 20px rgba(25,118,210,0.25),
              inset 0 1px 0 rgba(255,255,255,0.9);
          }
        }
      `}</style>
    </Paper>
  );
}

export default NavbarUniversal;