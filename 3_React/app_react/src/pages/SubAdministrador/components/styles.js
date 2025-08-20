// Estilos comunes para los componentes del SubAdministrador
export const subAdminStyles = {
  // Colores del tema
  colors: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrast: '#ffffff'
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrast: '#ffffff'
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
      contrast: '#ffffff'
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
      contrast: '#ffffff'
    },
    error: {
      main: '#d32f2f',
      light: '#f44336',
      dark: '#c62828',
      contrast: '#ffffff'
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
      contrast: '#ffffff'
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121'
    }
  },

  // Gradientes predefinidos
  gradients: {
    primary: ['#1976d2', '#1565c0'],
    secondary: ['#9c27b0', '#7b1fa2'],
    success: ['#2e7d32', '#1b5e20'],
    warning: ['#ed6c02', '#e65100'],
    error: ['#d32f2f', '#c62828'],
    info: ['#0288d1', '#01579b'],
    light: ['#f8f9fa', '#e9ecef'],
    dark: ['#424242', '#212121']
  },

  // Sombras
  shadows: {
    light: '0 2px 8px rgba(0,0,0,0.1)',
    medium: '0 4px 16px rgba(0,0,0,0.15)',
    heavy: '0 8px 32px rgba(0,0,0,0.2)',
    card: '0 2px 12px rgba(0,0,0,0.08)',
    table: '0 1px 8px rgba(0,0,0,0.06)'
  },

  // Bordes redondeados
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
    xlarge: 16,
    round: '50%'
  },

  // Espaciado
  spacing: {
    xs: 0.5,
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
    xxl: 6
  },

  // Transiciones
  transitions: {
    fast: '0.15s ease-in-out',
    normal: '0.25s ease-in-out',
    slow: '0.35s ease-in-out',
    hover: 'all 0.2s ease-in-out'
  },

  // Breakpoints personalizados
  breakpoints: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920
  },

  // Estilos de componentes específicos
  components: {
    // Layout
    layout: {
      background: "url('/img/Recepcion.jpg') no-repeat center center",
      backgroundSize: 'cover',
      minHeight: '100vh',
      width: '100vw'
    },

    // Paper container
    paperContainer: {
      borderRadius: 4,
      padding: 4,
      margin: '120px auto 40px auto',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(240,248,255,0.98) 100%)',
      border: '1px solid rgba(25, 118, 210, 0.2)',
      position: 'relative',
      backdropFilter: 'blur(10px)',
      width: '95vw',
      maxWidth: 1400,
      overflow: 'hidden'
    },

    // Header
    header: {
      borderRadius: 3,
      padding: 3,
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
    },

    // Tabla
    table: {
      header: {
        background: '#f8f9fa',
        borderBottom: '2px solid #dee2e6'
      },
      row: {
        '&:nth-of-type(odd)': { background: '#f8f9fa' },
        '&:hover': { background: '#e3f2fd' },
        transition: 'background-color 0.2s ease'
      },
      pagination: {
        background: '#f8f9fa',
        borderTop: '1px solid #dee2e6'
      }
    },

    // Botones
    buttons: {
      primary: {
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        color: '#ffffff',
        '&:hover': {
          background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)'
        }
      },
      secondary: {
        background: 'rgba(255,255,255,0.2)',
        color: '#ffffff',
        border: '1px solid rgba(255,255,255,0.3)',
        '&:hover': {
          background: 'rgba(255,255,255,0.3)',
          borderColor: 'rgba(255,255,255,0.5)'
        }
      },
      icon: {
        color: '#ffffff',
        background: 'rgba(255,255,255,0.1)',
        '&:hover': {
          background: 'rgba(255,255,255,0.2)'
        }
      }
    },

    // Alertas
    alerts: {
      success: {
        background: 'linear-gradient(135deg, #e8f5e8, #c8e6c9)',
        border: '1px solid #4caf50'
      },
      error: {
        background: 'linear-gradient(135deg, #ffebee, #ffcdd2)',
        border: '1px solid #f44336'
      },
      warning: {
        background: 'linear-gradient(135deg, #fff3e0, #ffe0b2)',
        border: '1px solid #ff9800'
      },
      info: {
        background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
        border: '1px solid #2196f3'
      }
    }
  },

  // Utilidades
  utils: {
    // Función para obtener color de estado
    getStatusColor: (status) => {
      const statusLower = status?.toLowerCase();
      if (statusLower === 'activo' || statusLower === 'active' || statusLower === 'aprobado' || statusLower === 'approved') {
        return '#2e7d32';
      }
      if (statusLower === 'inactivo' || statusLower === 'inactive' || statusLower === 'rechazado' || statusLower === 'rejected') {
        return '#d32f2f';
      }
      if (statusLower === 'pendiente' || statusLower === 'pending') {
        return '#ed6c02';
      }
      return '#757575';
    },

    // Función para obtener color de chip
    getChipColor: (status) => {
      const statusLower = status?.toLowerCase();
      if (statusLower === 'activo' || statusLower === 'active' || statusLower === 'aprobado' || statusLower === 'approved') {
        return 'success';
      }
      if (statusLower === 'inactivo' || statusLower === 'inactive' || statusLower === 'rechazado' || statusLower === 'rejected') {
        return 'error';
      }
      if (statusLower === 'pendiente' || statusLower === 'pending') {
        return 'warning';
      }
      return 'default';
    },

    // Función para formatear fecha
    formatDate: (date) => {
      if (!date) return 'N/A';
      try {
        return new Date(date).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (error) {
        return 'Fecha inválida';
      }
    },

    // Función para formatear fecha y hora
    formatDateTime: (date) => {
      if (!date) return 'N/A';
      try {
        return new Date(date).toLocaleString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (error) {
        return 'Fecha inválida';
      }
    },

    // Función para truncar texto
    truncateText: (text, maxLength = 50) => {
      if (!text || text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    },

    // Función para capitalizar primera letra
    capitalize: (text) => {
      if (!text) return '';
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }
  }
};

// Exportar estilos específicos para uso directo
export const {
  colors,
  gradients,
  shadows,
  borderRadius,
  spacing,
  transitions,
  breakpoints,
  components,
  utils
} = subAdminStyles;
