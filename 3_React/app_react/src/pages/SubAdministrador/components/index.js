// Componentes base del módulo SubAdministrador
export { default as SubAdminLayout } from './SubAdminLayout';
export { default as SubAdminHeader } from './SubAdminHeader';
export { default as SubAdminTable } from './SubAdminTable';
export {
  SubAdminAlert,
  SubAdminUniversalAlert,
  SubAdminSuccessSpinner,
  SubAdminConfirmDialog
} from './SubAdminAlerts';

// Componentes universales de alertas y spinners
export {
  SubAdminSuccessSpinner as SubAdminSuccessSpinnerUniversal,
  SubAdminUniversalAlert as SubAdminUniversalAlertUniversal,
  SubAdminLoadingSpinner,
  SubAdminCreateSuccessSpinner,
  SubAdminEditSuccessSpinner,
  SubAdminDeleteSuccessSpinner,
  SubAdminApproveSuccessSpinner,
  SubAdminRejectSuccessSpinner,
  SubAdminStateChangeSuccessSpinner
} from './SubAdminAlertsUniversal';

// Componentes universales basados en el estilo de GestionarRegistrosHorasExtra
export { default as SubAdminLayoutUniversal } from './SubAdminLayoutUniversal';
export { default as SubAdminHeaderUniversal } from './SubAdminHeaderUniversal';
export { default as SubAdminTableUniversal } from './SubAdminTableUniversal';
export { default as SubAdminStatsUniversal } from './SubAdminStatsUniversal';


// Estilos comunes
export * from './styles';
