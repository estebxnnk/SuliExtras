import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Fade,
  Portal,
  Slide
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Add as AddIcon,
  SwapHoriz as SwapHorizIcon
} from '@mui/icons-material';

// Spinner de éxito personalizable
export const SubAdminSuccessSpinner = ({
  open,
  onClose,
  title = '¡Éxito!',
  message = 'La operación se completó correctamente',
  icon = <CheckCircleIcon />,
  iconColor = '#4caf50',
  showLogo = true,
  size = 'medium',
  logoSrc = '/img/NuevoLogo.png',
  autoHideDuration,
  onAutoHideComplete
}) => {
  if (!open) return null;

  const getSize = () => {
    switch (size) {
      case 'small': return 60;
      case 'large': return 120;
      default: return 80;
    }
  };

  React.useEffect(() => {
    if (!open || !autoHideDuration) return;
    const t = setTimeout(() => {
      onClose?.();
      onAutoHideComplete?.();
    }, autoHideDuration);
    return () => clearTimeout(t);
  }, [open, autoHideDuration, onClose, onAutoHideComplete]);

  return (
    <Portal>
      <Fade in={open} timeout={300}>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20000,
            p: 2
          }}
          onClick={onClose}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px',
              gap: 3,
              p: 4,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(240,255,240,0.98) 100%)',
              borderRadius: 4,
              border: `3px solid ${iconColor}`,
              boxShadow: '0 20px 60px rgba(76,175,80,0.3)',
              backdropFilter: 'blur(20px)',
              animation: 'slideIn 0.5s ease-out',
              maxWidth: '90vw',
              width: '500px'
            }}
          >
            {showLogo && (
              <Box sx={{ width: 80, height: 80, animation: 'logoPulse 2s ease-in-out infinite' }}>
                <img
                  src={logoSrc}
                  alt="Logo"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
                />
              </Box>
            )}

            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress
                variant="determinate"
                value={100}
                size={getSize() + 24}
                thickness={4}
                sx={{ color: iconColor, opacity: 0.35, animation: 'successRing 1s ease-out' }}
              />
              <Box sx={{ position: 'absolute' }}>
                {React.cloneElement(icon, {
                  sx: { fontSize: getSize(), color: iconColor, animation: 'successScale 0.6s ease-out 0.3s both', filter: 'drop-shadow(0 4px 8px rgba(76,175,80,0.4))' }
                })}
              </Box>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h5"
                fontWeight={700}
                color={iconColor}
                sx={{ mb: 2, animation: 'successFadeIn 0.8s ease-out 0.5s both' }}
              >
                {title}
              </Typography>
              <Typography
                variant="body1"
                color="#333"
                sx={{ animation: 'successFadeIn 0.8s ease-out 0.7s both' }}
              >
                {message}
              </Typography>
            </Box>

            {/* Barra de progreso animada */}
            <Box
              sx={{
                width: '100%',
                height: 4,
                background: '#e0e0e0',
                borderRadius: 2,
                overflow: 'hidden',
                animation: 'progressBar 1.5s linear'
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  background: `linear-gradient(90deg, ${iconColor} 0%, ${iconColor} 100%)`,
                  animation: 'progressBar 1.5s linear'
                }}
              />
            </Box>

            <style>{`
              @keyframes slideIn {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
              }
              @keyframes logoPulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.05); opacity: 0.9; }
              }
              @keyframes successScale {
                0% { transform: scale(0); opacity: 0; }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); opacity: 1; }
              }
              @keyframes successRing {
                0% { stroke-dasharray: 0 283; }
                100% { stroke-dasharray: 283 283; }
              }
              @keyframes successFadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
              @keyframes progressBar {
               0% { width: 0%; }
               100% { width: 100%; }
             }
            `}</style>
          </Box>
        </Box>
      </Fade>
    </Portal>
  );
};

// Alerta universal reutilizable
export const SubAdminUniversalAlert = ({
  open,
  type = 'info',
  message = '',
  title = '',
  onClose,
  showLogo = false,
  autoHideDuration = 6000
}) => {
  if (!open) return null;

  const getConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircleIcon sx={{ fontSize: 32 }} />,
          color: '#4caf50',
          background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.95) 0%, rgba(76, 175, 80, 0.9) 100%)',
          borderColor: '#4caf50',
          iconColor: '#fff'
        };
      case 'error':
        return {
          icon: <ErrorIcon sx={{ fontSize: 32 }} />,
          color: '#f44336',
          background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.95) 0%, rgba(244, 67, 54, 0.9) 100%)',
          borderColor: '#f44336',
          iconColor: '#fff'
        };
      case 'warning':
        return {
          icon: <WarningIcon sx={{ fontSize: 32 }} />,
          color: '#ff9800',
          background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.95) 0%, rgba(255, 152, 0, 0.9) 100%)',
          borderColor: '#ff9800',
          iconColor: '#fff'
        };
      case 'info':
      default:
        return {
          icon: <InfoIcon sx={{ fontSize: 32 }} />,
          color: '#2196f3',
          background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.95) 0%, rgba(33, 150, 243, 0.9) 100%)',
          borderColor: '#2196f3',
          iconColor: '#fff'
        };
    }
  };

  const cfg = getConfig();

  React.useEffect(() => {
    if (!open || !autoHideDuration) return;
    const t = setTimeout(() => {
      onClose?.();
    }, autoHideDuration);
    return () => clearTimeout(t);
  }, [open, autoHideDuration, onClose]);

  return (
    <Slide direction="up" in={open} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          minWidth: 400,
          maxWidth: 600,
          width: '90vw'
        }}
      >
        <Box
          sx={{
            background: cfg.background,
            border: `3px solid ${cfg.borderColor}`,
            borderRadius: 4,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(20px)',
            overflow: 'hidden',
            animation: 'slideIn 0.5s ease-out'
          }}
        >
          {/* Header con logo y título */}
          <Box sx={{
            p: 3,
            background: 'rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            {showLogo && (
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  animation: 'logoPulse 2s ease-in-out infinite'
                }}
              >
                <img
                  src="/img/NuevoLogo.png"
                  alt="SuliExtras Logo"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                  }}
                />
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
              {cfg.icon}
              <Typography variant="h6" fontWeight={700} color="#fff">
                {title || (type === 'success' ? 'Éxito' : type === 'error' ? 'Error' : type === 'warning' ? 'Advertencia' : 'Información')}
              </Typography>
            </Box>

            <IconButton
              onClick={onClose}
              sx={{
                color: '#fff',
                '&:hover': { background: 'rgba(255,255,255,0.2)' }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Contenido del mensaje */}
          <Box sx={{ p: 3, background: 'rgba(255,255,255,0.95)' }}>
            <Typography variant="body1" color="#333" sx={{ lineHeight: 1.6, textAlign: 'center' }}>
              {message}
            </Typography>
          </Box>
        </Box>

        {/* Estilos CSS para las animaciones */}
        <style>
          {`
            @keyframes slideIn {
              from { opacity: 0; transform: translate(-50%, -60%); }
              to { opacity: 1; transform: translate(-50%, -50%); }
            }
            @keyframes logoPulse {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.05); opacity: 0.9; }
            }
          `}
        </style>
      </Box>
    </Slide>
  );
};

// Spinner de carga personalizable
export const SubAdminLoadingSpinner = ({
  open = true,
  message = "Cargando...",
  size = "medium",
  showLogo = true
}) => {
  if (!open) return null;

  const getSize = () => {
    switch (size) {
      case 'small':
        return 40;
      case 'medium':
        return 64;
      case 'large':
        return 80;
      default:
        return 64;
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        p: 2
      }}
    >
      <Paper
        elevation={8}
        sx={{
          borderRadius: 3,
          p: 3,
          maxWidth: 400,
          width: '100%',
          textAlign: 'center'
        }}
      >
        {showLogo && (
          <Box
            sx={{
              width: getSize(),
              height: getSize(),
              borderRadius: '50%',
              border: `4px solid rgba(25, 118, 210, 0.2)`,
              borderTop: `4px solid #1976d2`,
              animation: 'spin 1s linear infinite',
              mx: 'auto',
              mb: 2,
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }}
          />
        )}
        
        <Typography variant="h6" color="text.primary" sx={{ mb: 1 }}>
          {message}
        </Typography>
      </Paper>
    </Box>
  );
};

// Spinner de éxito específico para diferentes operaciones
export const SubAdminCreateSuccessSpinner = (props) => (
  <SubAdminSuccessSpinner
    {...props}
    title={props.title || '¡Creado!'}
    message={props.message || 'Registro creado exitosamente'}
    icon={<AddIcon sx={{ fontSize: 48 }} />}
    iconColor="#4caf50"
    autoHideDuration={props.autoHideDuration ?? 1500}
    onAutoHideComplete={props.onComplete}
  />
);

export const SubAdminEditSuccessSpinner = (props) => (
  <SubAdminSuccessSpinner
    {...props}
    title={props.title || '¡Editado!'}
    message={props.message || 'Registro editado exitosamente'}
    icon={<EditIcon sx={{ fontSize: 48 }} />}
    iconColor="#1976d2"
    autoHideDuration={props.autoHideDuration ?? 1500}
    onAutoHideComplete={props.onComplete}
  />
);

export const SubAdminDeleteSuccessSpinner = (props) => (
  <SubAdminSuccessSpinner
    {...props}
    title={props.title || '¡Eliminado!'}
    message={props.message || 'Registro eliminado exitosamente'}
    icon={<DeleteIcon sx={{ fontSize: 48 }} />}
    iconColor="#f44336"
    autoHideDuration={props.autoHideDuration ?? 1500}
    onAutoHideComplete={props.onComplete}
  />
);

export const SubAdminApproveSuccessSpinner = (props) => (
  <SubAdminSuccessSpinner
    {...props}
    title={props.title || '¡Aprobado!'}
    message={props.message || 'Registro aprobado exitosamente'}
    icon={<ThumbUpIcon sx={{ fontSize: 48 }} />}
    iconColor="#4caf50"
    autoHideDuration={props.autoHideDuration ?? 1500}
    onAutoHideComplete={props.onComplete}
  />
);

export const SubAdminRejectSuccessSpinner = (props) => (
  <SubAdminSuccessSpinner
    {...props}
    title={props.title || '¡Rechazado!'}
    message={props.message || 'Registro rechazado exitosamente'}
    icon={<ThumbDownIcon sx={{ fontSize: 48 }} />}
    iconColor="#ff9800"
    autoHideDuration={props.autoHideDuration ?? 1500}
    onAutoHideComplete={props.onComplete}
  />
);

export const SubAdminStateChangeSuccessSpinner = (props) => (
  <SubAdminSuccessSpinner
    {...props}
    title={props.title || '¡Estado Cambiado!'}
    message={props.message || 'El estado se cambió exitosamente'}
    icon={<SwapHorizIcon sx={{ fontSize: 48 }} />}
    iconColor="#9c27b0"
    autoHideDuration={props.autoHideDuration ?? 1500}
    onAutoHideComplete={props.onComplete}
  />
);


// Aliases compatibles con GestionarRegistrosHorasExtra
export const UniversalAlert = (props) => (
  <SubAdminUniversalAlert {...props} />
);

export const SuccessSpinner = ({ onComplete, size = 'medium', message = '¡Operación exitosa!', ...rest }) => (
  <SubAdminSuccessSpinner
    {...rest}
    title={rest.title || '¡Éxito!'}
    message={message}
    icon={<CheckCircleIcon sx={{ fontSize: 80 }} />}
    iconColor="#4caf50"
    autoHideDuration={rest.autoHideDuration ?? 1500}
    onAutoHideComplete={onComplete}
  />
);

export const CreateSuccessSpinner = (props) => (
  <SubAdminCreateSuccessSpinner {...props} />
);

export const EditSuccessSpinner = (props) => (
  <SubAdminEditSuccessSpinner {...props} />
);

export const DeleteSuccessSpinner = (props) => (
  <SubAdminDeleteSuccessSpinner {...props} />
);

export const ApproveSuccessSpinner = (props) => (
  <SubAdminApproveSuccessSpinner {...props} />
);

export const RejectSuccessSpinner = (props) => (
  <SubAdminRejectSuccessSpinner {...props} />
);

export const StateChangeSuccessSpinner = (props) => (
  <SubAdminStateChangeSuccessSpinner {...props} />
);

