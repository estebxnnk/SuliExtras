export const CONFIG = {
  // API Configuration
  API: {
    BASE_URL: 'http://localhost:3000/api',
    ENDPOINTS: {
      USUARIOS: '/usuarios',
      REGISTROS_USUARIO: '/registros/usuario-completo'
    }
  },

  // Pagination Configuration
  PAGINATION: {
    DEFAULT_PAGE: 0,
    DEFAULT_ROWS_PER_PAGE: 10,
    ROWS_PER_PAGE_OPTIONS: [5, 10, 25, 50]
  },

  // Search Configuration
  SEARCH: {
    DEBOUNCE_DELAY: 300,
    MIN_CHARACTERS: 2
  },

  // Export Configuration
  EXPORT: {
    WORD: {
      FILENAME_PREFIX: 'Reporte_Horas_Extra_',
      FILENAME_SUFFIX: '.docx'
    },
    EXCEL: {
      FILENAME_PREFIX: 'Reporte_Horas_Extra_',
      FILENAME_SUFFIX: '.xlsx'
    }
  },

  // Styles Configuration
  STYLES: {
    COLORS: {
      PRIMARY: '#9c27b0',
      SECONDARY: '#7b1fa2',
      SUCCESS: '#2e7d32',
      WARNING: '#ed6c02',
      ERROR: '#d32f2f',
      INFO: '#1976d2'
    },
    GRADIENTS: {
      PRIMARY: ['#9c27b0', '#7b1fa2'],
      SUCCESS: ['#2e7d32', '#1b5e20'],
      WARNING: ['#ed6c02', '#e65100'],
      ERROR: ['#d32f2f', '#c62828'],
      INFO: ['#1976d2', '#1565c0']
    }
  },

  // Messages Configuration
  MESSAGES: {
    SUCCESS: {
      USUARIOS_ACTUALIZADOS: 'Lista de usuarios actualizada',
      REPORTE_GENERADO: 'Reporte generado exitosamente',
      WORD_DESCARGADO: 'Documento Word descargado exitosamente',
      EXCEL_DESCARGADO: 'Documento Excel descargado exitosamente'
    },
    ERROR: {
      CARGAR_USUARIOS: 'Error al cargar usuarios',
      CARGAR_REGISTROS: 'Error al cargar registros',
      GENERAR_REPORTE: 'Error al generar reporte',
      DESCARGAR_WORD: 'Error al descargar Word',
      DESCARGAR_EXCEL: 'Error al descargar Excel'
    },
    WARNING: {
      SIN_REGISTROS: 'Este usuario no tiene registros aprobados para generar reporte'
    }
  },

  // Calculations Configuration
  CALCULATIONS: {
    HORAS_POR_MES: 240,
    DECIMAL_PLACES: 2
  }
};
