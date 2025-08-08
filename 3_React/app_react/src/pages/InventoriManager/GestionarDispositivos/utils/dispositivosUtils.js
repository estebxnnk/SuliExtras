import React from 'react';
import {
  CheckCircle as CheckCircleIcon,
  Assignment as AssignmentIcon,
  Build as BuildIcon,
  Cancel as CancelIcon,
  Computer as ComputerIcon,
  Print as PrintIcon,
  Phone as PhoneIcon,
  Tablet as TabletIcon,
  Router as RouterIcon,
  Storage as StorageIcon,
  Monitor as MonitorIcon,
  Scanner as ScannerIcon,
  Camera as CameraIcon,
  Videocam as VideocamIcon,
  Tv as TvIcon,
  Speaker as SpeakerIcon,
  Security as SecurityIcon,
  Mouse as MouseIcon,
  Keyboard as KeyboardIcon,
  Headset as HeadsetIcon,
  Memory as MemoryIcon
} from '@mui/icons-material';

// Estados de dispositivos
export const estados = [
  { value: 'DISPONIBLE', label: 'Disponible', color: 'success', icon: React.createElement(CheckCircleIcon) },
  { value: 'ASIGNADO', label: 'Asignado', color: 'primary', icon: React.createElement(AssignmentIcon) },
  { value: 'MANTENIMIENTO', label: 'Mantenimiento', color: 'warning', icon: React.createElement(BuildIcon) },
  { value: 'BAJA', label: 'Baja', color: 'error', icon: React.createElement(CancelIcon) }
];

// Obtener información del estado
export const getEstadoInfo = (estado) => {
  return estados.find(e => e.value === estado) || estados[0];
};

// Formatear moneda
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '-';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP'
  }).format(amount);
};

// Función para detectar el tipo de dispositivo
export const obtenerTipoDispositivo = (dispositivo) => {
  if (!dispositivo) {
    return 'DESCONOCIDO';
  }

  // Prioridad 1: tipo_dispositivo (discriminator column)
  if (dispositivo.tipo_dispositivo) {
    return dispositivo.tipo_dispositivo;
  }
  
  // Prioridad 2: campo tipo
  if (dispositivo.tipo) {
    return dispositivo.tipo;
  }
  
  // Prioridad 3: Detectar por campos específicos
  if (dispositivo.imei1 || dispositivo.imei2) return 'CELULAR';
  if (dispositivo.numeroPda) return 'PDA';
  if (dispositivo.ipAsignada && dispositivo.tipoCamara) return 'CAMARA';
  if (dispositivo.ipAsignada && dispositivo.tipoBiometrico) return 'BIOMETRICO';
  if (dispositivo.macAddress && dispositivo.tipoCamara) return 'CAMARA';
  if (dispositivo.numeroSerieCompleto) return 'INTERCOMUNICADOR';
  
  // Prioridad 4: Por la URL del endpoint
  if (dispositivo._endpoint) {
    if (dispositivo._endpoint.includes('celulares')) return 'CELULAR';
    if (dispositivo._endpoint.includes('pdas')) return 'PDA';
    if (dispositivo._endpoint.includes('camaras')) return 'CAMARA';
    if (dispositivo._endpoint.includes('biometricos')) return 'BIOMETRICO';
    if (dispositivo._endpoint.includes('intercomunicadores')) return 'INTERCOMUNICADOR';
  }
  
  return 'DESCONOCIDO';
};

// Función para formatear nombres de tipos para mostrar
export const formatearTipo = (tipo) => {
  const nombres = {
    'BIOMETRICO': 'Biométrico',
    'PDA': 'PDA',
    'CELULAR': 'Celular',
    'INTERCOMUNICADOR': 'Intercomunicador',
    'CAMARA': 'Cámara',
    'IMPRESORA': 'Impresora',
    'COMPUTADOR': 'Computador',
    'LAPTOP': 'Laptop',
    'TABLET': 'Tablet',
    'MONITOR': 'Monitor',
    'SCANNER': 'Escáner',
    'ROUTER': 'Router',
    'SERVIDOR': 'Servidor',
    'TELEFONO': 'Teléfono',
    'VIDEOBEAM': 'Videobeam',
    'TELEVISOR': 'Televisor',
    'SPEAKER': 'Parlante',
    'SECURITY': 'Cámara de Seguridad',
    'MOUSE': 'Mouse',
    'TECLADO': 'Teclado',
    'AUDIFONOS': 'Audífonos',
    'DESCONOCIDO': 'Otro'
  };
  return nombres[tipo] || tipo;
};

// Función para obtener colores dinámicos según tipo de dispositivo
export const getDispositivoColor = (tipo) => {
  const tipoString = typeof tipo === 'object' ? (tipo?.tipo || '') : tipo;
  const tipoNormalizado = tipoString?.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  switch (tipoNormalizado) {
    case 'laptop':
    case 'computador':
    case 'computadora':
    case 'portatil':
    case 'pc':
    case 'desktop':
      return '#1976d2'; // Azul
    case 'impresora':
    case 'printer':
      return '#388e3c'; // Verde
    case 'telefono':
    case 'celular':
    case 'movil':
    case 'smartphone':
      return '#f57c00'; // Naranja
    case 'tablet':
    case 'tableta':
      return '#7b1fa2'; // Púrpura
    case 'router':
    case 'switch':
    case 'modem':
      return '#d32f2f'; // Rojo
    case 'servidor':
    case 'server':
      return '#455a64'; // Gris azulado
    case 'monitor':
    case 'pantalla':
    case 'display':
      return '#0288d1'; // Azul claro
    case 'scanner':
    case 'escaner':
      return '#689f38'; // Verde lima
    case 'camara':
    case 'camera':
      return '#e91e63'; // Rosa
    case 'videocamara':
    case 'videocam':
      return '#ff5722'; // Naranja profundo
    case 'televisor':
    case 'tv':
    case 'television':
      return '#795548'; // Marrón
    case 'parlante':
    case 'altavoz':
    case 'speaker':
    case 'bocina':
      return '#9c27b0'; // Púrpura vibrante
    case 'camara de seguridad':
    case 'security camera':
    case 'cctv':
    case 'security':
    case 'biometrico':
      return '#ff9800'; // Ámbar
    case 'mouse':
    case 'raton':
      return '#607d8b'; // Gris azul
    case 'teclado':
    case 'keyboard':
      return '#424242'; // Gris oscuro
    case 'audifonos':
    case 'headset':
      return '#8bc34a'; // Verde claro
    case 'pda':
      return '#ff6f00'; // Naranja oscuro
    case 'intercomunicador':
      return '#3f51b5'; // Índigo
    default:
      return '#666666'; // Gris por defecto
  }
};

// Función para obtener iconos de dispositivos
export const getDispositivoIcon = (tipo) => {
  if (!tipo) {
    return React.createElement(MemoryIcon);
  }
  
  const tipoString = typeof tipo === 'object' ? (tipo?.tipo || '') : tipo;
  const tipoNormalizado = tipoString?.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  switch (tipoNormalizado) {
    case 'laptop':
    case 'computador':
    case 'computadora':
    case 'portatil':
    case 'pc':
    case 'desktop':
      return React.createElement(ComputerIcon);
    case 'impresora':
    case 'printer':
      return React.createElement(PrintIcon);
    case 'telefono':
    case 'celular':
    case 'movil':
    case 'smartphone':
      return React.createElement(PhoneIcon);
    case 'tablet':
    case 'tableta':
      return React.createElement(TabletIcon);
    case 'router':
    case 'switch':
    case 'modem':
      return React.createElement(RouterIcon);
    case 'servidor':
    case 'server':
      return React.createElement(StorageIcon);
    case 'monitor':
    case 'pantalla':
    case 'display':
      return React.createElement(MonitorIcon);
    case 'scanner':
    case 'escaner':
      return React.createElement(ScannerIcon);
    case 'camara':
    case 'camera':
      return React.createElement(CameraIcon);
    case 'videocamara':
    case 'videocam':
      return React.createElement(VideocamIcon);
    case 'televisor':
    case 'tv':
    case 'television':
      return React.createElement(TvIcon);
    case 'parlante':
    case 'altavoz':
    case 'speaker':
    case 'bocina':
      return React.createElement(SpeakerIcon);
    case 'camara de seguridad':
    case 'security camera':
    case 'cctv':
      return React.createElement(SecurityIcon);
    case 'mouse':
    case 'raton':
      return React.createElement(MouseIcon);
    case 'teclado':
    case 'keyboard':
      return React.createElement(KeyboardIcon);
    case 'audifonos':
    case 'headset':
      return React.createElement(HeadsetIcon);
    default:
      return React.createElement(MemoryIcon);
  }
};

// Obtener tipos únicos disponibles con conteos
export const getTiposDisponibles = (dispositivos) => {
  const tiposSet = new Set();
  
  dispositivos.forEach(dispositivo => {
    if (dispositivo) {
      const tipo = obtenerTipoDispositivo(dispositivo);
      if (tipo && tipo !== 'DESCONOCIDO') {
        tiposSet.add(tipo);
      }
    }
  });
  
  const tipos = Array.from(tiposSet).map(tipo => {
    const count = dispositivos.filter(d => d && obtenerTipoDispositivo(d) === tipo).length;
    return {
      value: tipo,
      label: formatearTipo(tipo),
      count: count
    };
  }).sort((a, b) => a.label.localeCompare(b.label));
  
  return [{ value: '', label: 'Todos los tipos', count: dispositivos.length }, ...tipos];
};

// Función para filtrar dispositivos
export const filtrarDispositivos = (dispositivos, searchTerm, filters) => {
  return dispositivos.filter(dispositivo => {
    if (!dispositivo) {
      return false;
    }

    const matchesSearch = (
      (dispositivo.item && dispositivo.item.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (dispositivo.serial && dispositivo.serial.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (dispositivo.modelo && dispositivo.modelo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (dispositivo.marca && dispositivo.marca.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (dispositivo.codigoActivo && dispositivo.codigoActivo.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const matchesFilters = (
      (!filters.estado || dispositivo.estado === filters.estado) &&
      (!filters.sede || dispositivo.sede?.sedeId?.toString() === filters.sede) &&
      (!filters.funcional || dispositivo.funcional?.toString() === filters.funcional) &&
      (!filters.tipoDispositivo || (dispositivo.tipo_dispositivo || dispositivo.tipo || 'DESCONOCIDO') === filters.tipoDispositivo)
    );

    return matchesSearch && matchesFilters;
  });
};

// Función para paginar dispositivos
export const paginarDispositivos = (dispositivos, page, rowsPerPage) => {
  return dispositivos.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
}; 