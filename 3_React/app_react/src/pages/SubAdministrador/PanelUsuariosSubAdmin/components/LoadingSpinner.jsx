import { Box, Typography, CircularProgress } from '@mui/material';

function LoadingSpinner({ message = 'Cargando...', size = 'large' }) {
  const spinnerSize = size === 'large' ? 80 : size === 'medium' ? 60 : 40;
  const logoSize = size === 'large' ? 120 : size === 'medium' ? 90 : 60;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        gap: 3,
        p: 4
      }}
    >
      {/* Logo con animación de rotación */}
      <Box
        sx={{
          position: 'relative',
          width: logoSize,
          height: logoSize,
          animation: 'pulse 2s ease-in-out infinite'
        }}
      >
        <img
          src="/img/NuevoLogo.png"
          alt="SuliExtras Logo"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
          }}
        />
        {/* Overlay de brillo */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
            animation: 'shimmer 2s ease-in-out infinite',
            borderRadius: '50%'
          }}
        />
      </Box>

      {/* Spinner circular */}
      <Box sx={{ position: 'relative' }}>
        <CircularProgress
          size={spinnerSize}
          thickness={4}
          sx={{
            color: '#1976d2',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            }
          }}
        />
        {/* Spinner interno más pequeño */}
        <CircularProgress
          size={spinnerSize * 0.7}
          thickness={3}
          sx={{
            color: '#4caf50',
            position: 'absolute',
            top: '15%',
            left: '15%',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            }
          }}
        />
      </Box>

      {/* Mensaje de carga */}
      <Typography
        variant="h6"
        color="primary"
        sx={{
          fontWeight: 600,
          textAlign: 'center',
          animation: 'fadeInOut 2s ease-in-out infinite',
          textShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        {message}
      </Typography>

      {/* Estilos CSS para las animaciones */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.05);
              opacity: 0.8;
            }
          }
          
          @keyframes shimmer {
            0% {
              transform: translateX(-100%) rotate(0deg);
            }
            100% {
              transform: translateX(100%) rotate(360deg);
            }
          }
          
          @keyframes fadeInOut {
            0%, 100% {
              opacity: 0.7;
            }
            50% {
              opacity: 1;
            }
          }
        `}
      </style>
    </Box>
  );
}

export default LoadingSpinner; 