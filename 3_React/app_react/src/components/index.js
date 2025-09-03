// Componentes base del módulo SubAdministrador
export { default as TableUniversal } from './TableUniversal';

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
} from './spinners/SpinnersUniversal';

// Aliases para compatibilidad con otros módulos
export {
  UniversalAlert,
  SuccessSpinner,
  CreateSuccessSpinner,
  EditSuccessSpinner,
  DeleteSuccessSpinner,
  ApproveSuccessSpinner,
  RejectSuccessSpinner,
  StateChangeSuccessSpinner
} from './spinners/SpinnersUniversal';

// Componentes universales basados en el estilo de GestionarRegistrosHorasExtra
export { default as LayoutUniversal } from './LayoutUniversal';
export { default as HeaderUniversal } from './HeaderUniversal';
export { default as ReportesTableUniversal } from './ReportesTableUniversal';
export { default as StatsUniversal } from './StatsUniversal';
export { default as FiltersUniversal } from './FiltersUniversal';
export { InitialPageLoader } from './spinners/SpinnersUniversal';
export { default as ConfirmDialogUniversal } from './ConfirmDialogUniversal';
export { default as NavbarUniversal } from './NavbarUniversal';
export { default as SidebarUniversal } from './SidebarUniversal';
export { default as RegistrarUsuarioUniversal } from './users/RegistrarUsuarioUniversal';

// Nuevo: Dashboard global para SubAdmin
export { default as DashboardforRegistrosHorasExtraUniversal } from './Dashboard/DashboardforRegistrosHorasExtraUniversal';

// Componentes de diálogos globales
export * from './dialog';

