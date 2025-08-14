export const CONFIG = {
  // Configuración de la API
  API: {
    BASE_URL: 'http://localhost:3000/api',
    ENDPOINTS: {
      USUARIOS: '/usuarios',
      REGISTROS_USUARIO: '/registros/usuario-completo'
    }
  },

  // Configuración de paginación
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50]
  },

  // Configuración de búsqueda
  SEARCH: {
    DEBOUNCE_DELAY: 300,
    MIN_SEARCH_LENGTH: 2
  },

  // Configuración de exportación
  EXPORT: {
    WORD: {
      LOGO_URL: '/img/NuevoLogo.png',
      LOGO_SIZE: { width: 120, height: 60 }
    },
    EXCEL: {
      SHEET_NAME: 'Reporte',
      HEADERS: [
        'Fecha', 'Tipo', 'Denominación',
        'Horas Extra (reporte)', 'Valor Horas Extra',
        'Bono Salarial (horas)', 'Valor Bono Salarial',
        'Recargo', 'Valor Hora Extra'
      ]
    }
  },

  // Configuración de estilos
  STYLES: {
    COLORS: {
      PRIMARY: '#1976d2',
      SECONDARY: '#1565c0',
      SUCCESS: '#4caf50',
      WARNING: '#ff9800',
      ERROR: '#f44336',
      INFO: '#2196f3'
    },
    GRADIENTS: {
      PRIMARY: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
      SUCCESS: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
      WARNING: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)'
    }
  },

  // Configuración de mensajes
  MESSAGES: {
    LOADING: {
      MODULE: 'Cargando módulo de reportes...',
      USUARIOS: 'Cargando usuarios...',
      REGISTROS: 'Cargando registros...',
      REPORTE: 'Generando reporte...'
    },
    SUCCESS: {
      USUARIOS_CARGADOS: 'Usuarios cargados exitosamente',
      REGISTROS_CARGADOS: 'Registros cargados exitosamente',
      REPORTE_GENERADO: 'Reporte generado exitosamente',
      WORD_DESCARGADO: 'Documento Word descargado exitosamente',
      EXCEL_DESCARGADO: 'Documento Excel descargado exitosamente'
    },
    ERROR: {
      USUARIOS: 'Error al cargar usuarios',
      REGISTROS: 'Error al cargar registros',
      REPORTE: 'Error al generar reporte',
      WORD: 'Error al descargar documento Word',
      EXCEL: 'Error al descargar documento Excel'
    }
  },

  // Configuración de cálculos
  CALCULATIONS: {
    HORAS_MENSUALES: 240,
    DECIMAL_PLACES: 2
  }
};
