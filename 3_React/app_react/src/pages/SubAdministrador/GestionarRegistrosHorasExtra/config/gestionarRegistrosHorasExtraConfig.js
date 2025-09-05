// Configuración del módulo GestionarRegistrosHorasExtra

export const CONFIG = {
  // Configuración de la API
  API: {
    BASE_URL: 'http://localhost:3000/api',
    ENDPOINTS: {
      REGISTROS: '/registros',
      TIPOS_HORA: '/horas',
      USUARIOS: '/usuarios'
    },
    TIMEOUT: 30000, // 30 segundos
    RETRY_ATTEMPTS: 3
  },

  // Configuración de la interfaz
  UI: {
    ROWS_PER_PAGE_OPTIONS: [5, 10, 25, 50],
    DEFAULT_ROWS_PER_PAGE: 10,
    DEFAULT_PAGE: 0,
    SEARCH_DEBOUNCE: 300, // milisegundos
    MAX_SEARCH_LENGTH: 100
  },

  // Configuración de validaciones
  VALIDATION: {
    HORAS_EXTRA: {
      MIN: 1,
      MAX: 24,
      DECIMAL_PLACES: 2
    },
    HORAS_REPORTE: {
      MAX: 2,
      DECIMAL_PLACES: 2
    },
    JUSTIFICACION: {
      MIN_LENGTH: 10,
      MAX_LENGTH: 500
    }
  },

  // Estados de los registros
  ESTADOS: {
    PENDIENTE: 'pendiente',
    APROBADO: 'aprobado',
    RECHAZADO: 'rechazado'
  },

  // Configuración de filtros
  FILTROS: {
    ESTADOS: [
      { value: 'todos', label: 'Todos los estados' },
      { value: 'pendiente', label: 'Pendiente' },
      { value: 'aprobado', label: 'Aprobado' },
      { value: 'rechazado', label: 'Rechazado' }
    ],
    CAMPOS_BUSQUEDA: [
      'usuario',
      'numRegistro',
      'ubicacion'
    ]
  },

  // Configuración de paginación
  PAGINACION: {
    LABELS: {
      ROWS_PER_PAGE: 'Filas por página',
      OF: 'de',
      NEXT: 'Siguiente',
      PREVIOUS: 'Anterior'
    }
  },

  // Configuración de mensajes
  MENSAJES: {
    SUCCESS: {
      REGISTRO_CREADO: '¡Registro creado exitosamente! Redirigiendo al panel de registros...',
      REGISTRO_ACTUALIZADO: 'Registro actualizado exitosamente.',
      ESTADO_ACTUALIZADO: 'Estado del registro actualizado exitosamente.',
      REGISTRO_APROBADO: 'Registro aprobado exitosamente.',
      REGISTRO_RECHAZADO: 'Registro rechazado exitosamente.',
      REGISTRO_ELIMINADO: 'Registro eliminado exitosamente.'
    },
    ERROR: {
      CARGAR_REGISTROS: 'No se pudieron cargar los registros de horas extra.',
      CARGAR_TIPOS_HORA: 'No se pudieron cargar los tipos de hora.',
      CARGAR_USUARIOS: 'No se pudieron cargar los usuarios.',
      ACTUALIZAR_REGISTRO: 'No se pudo actualizar el registro.',
      ACTUALIZAR_ESTADO: 'No se pudo actualizar el estado del registro.',
      ELIMINAR_REGISTRO: 'No se pudo eliminar el registro.',
      CREAR_REGISTRO: 'Error al crear el registro: ',
      CONEXION_SERVIDOR: 'No se pudo conectar con el servidor.',
      VALIDACION: 'Error: Debes completar todos los campos requeridos.',
      HORAS_INVALIDAS: 'Error: Debes ingresar una cantidad válida de horas extra (mínimo 1 hora).'
    },
    INFO: {
      NO_REGISTROS: 'No hay registros de horas extra.',
      CARGANDO: 'Cargando registros...',
      REGISTRO_PROCESSADO: 'Este registro ya ha sido procesado. Solo puedes cambiar su estado.',
      ACCION_IRREVERSIBLE: '⚠️ Esta acción no se puede deshacer'
    }
  },

  // Configuración de diálogos
  DIALOGS: {
    CONFIRMACION: {
      TITULOS: {
        ELIMINAR: 'Confirmar Eliminación',
        APROBAR: 'Confirmar Aprobación',
        RECHAZAR: 'Confirmar Rechazo'
      },
      MENSAJES: {
        ELIMINAR: '¿Estás seguro que deseas ELIMINAR el registro del empleado',
        APROBAR: '¿Estás seguro que deseas APROBAR el registro del empleado',
        RECHAZAR: '¿Estás seguro que deseas RECHAZAR el registro del empleado'
      }
    }
  },

  // Configuración de rutas
  ROUTES: {
    PANEL_PRINCIPAL: '/subadmin/gestionar-registros-horas-extra',
    CREAR_REGISTRO: '/subadmin/crear-registros-horas-extra'
  },

  // Configuración de estilos
  STYLES: {
    COLORS: {
      PRIMARY: '#1976d2',
      SUCCESS: '#4caf50',
      WARNING: '#ff9800',
      ERROR: '#f44336',
      INFO: '#2196f3'
    },
    BACKGROUNDS: {
      PAPER: 'rgba(255,255,255,0.95)',
      TABLE_HEADER: '#e3f2fd',
      TABLE_HOVER: '#e3f2fd',
      SUCCESS_GRADIENT: 'linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%)',
      WARNING_GRADIENT: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
      INFO_GRADIENT: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
    }
  }
};

// Configuración específica para diferentes entornos
export const getConfig = (environment = 'development') => {
  const baseConfig = { ...CONFIG };
  
  switch (environment) {
    case 'production':
      baseConfig.API.BASE_URL = 'https://api.suliextras.com/api';
      baseConfig.API.TIMEOUT = 60000;
      break;
    case 'staging':
      baseConfig.API.BASE_URL = 'https://staging-api.suliextras.com/api';
      baseConfig.API.TIMEOUT = 45000;
      break;
    case 'development':
    default:
      // Usar configuración por defecto
      break;
  }
  
  return baseConfig;
};

// Exportar configuración por defecto
export default CONFIG; 