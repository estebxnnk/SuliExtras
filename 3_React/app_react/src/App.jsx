import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../security/ProtectedRoute';

//Home
import Home from './pages/Home/Home';
import Contactanos from './pages/Home/Contactanos';
import Login from './pages/Home/Login';

//Rol Sub Administrador
import PanelSubAdmin from './pages/SubAdministrador/PanelSubAdmin/index';
import RegistrarUsuarioSubAdmin from './pages/SubAdministrador/GestionarUsuarios/RegistrarUsuarioSubAdmin';
import PanelUsuariosSubAdmin from './pages/SubAdministrador/GestionarUsuarios/index';
import CrearRegistroHorasExtraSubAdmin from './pages/SubAdministrador/GestionarRegistrosHorasExtra';
import GestionReportesHorasExtra from './pages/SubAdministrador/GestionReportesHorasExtra';
import GestionarRegistrosHorasExtra from './pages/SubAdministrador/GestionarRegistrosHorasExtra';

//Rol Administrador
import PanelAdministrativo from './pages/Administrador/PanelAdministrativo';
import PanelUsuariosAdministrativo from './pages/Administrador/PanelUsuariosAdministrativo';
import RegistrarUsuario from './pages/Administrador/RegistrarUsuario';

//Rol JefeDirecto
import PanelJefeDirecto from './pages/JefeDirecto/PanelJefeDirecto';
import PanelRegistrosHorasExtra from './pages/JefeDirecto/PanelRegistrosHorasExtra';
import CrearRegistroHorasExtra from './pages/JefeDirecto/CrearRegistroHorasExtra';
import GestionarTiposHora from './pages/JefeDirecto/GestionarTiposHora';
import PanelUsuarios from './pages/JefeDirecto/PanelUsuarios';

// Rol Empleado
import PanelEmpleado from './pages/Empleado/PanelEmpleado';
import MisRegistros from './pages/Empleado/MisRegistros';
import CrearRegistroHorasEmpleado from './pages/Empleado/CrearRegistroHorasEmpleado';

// Rol InventoryManager
import PanelInventoryManager from './pages/InventoriManager/PanelInventoryManager';
import GestionarDispositivos from './pages/InventoriManager/GestionarDispositivos';
// Componente
import AsignacionesDialog from './pages/InventoriManager/components/AsignacionesDialog';
import GestionarCategorias from './pages/InventoriManager/GestionarCategorias';
import GestionarSedes from './pages/InventoriManager/GestionarSedes';
import ReportesInventario from './pages/InventoriManager/ReportesInventario';
import EstadisticasDispositivos from './pages/InventoriManager/EstadisticasDispositivos';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contactanos" element={<Contactanos />} />
        <Route path="/panel-sub-admin" element={
          <ProtectedRoute allowedRoles={['SubAdministrador']}>
            <PanelSubAdmin />
          </ProtectedRoute>
        } />
        <Route path="/registrar-usuario" element={
          <ProtectedRoute allowedRoles={['SubAdministrador']}>
            <RegistrarUsuarioSubAdmin />
          </ProtectedRoute>
        } />
        <Route path="/usuarios" element={
          <ProtectedRoute allowedRoles={['SubAdministrador']}>
            <PanelUsuariosSubAdmin />
          </ProtectedRoute>
        } />
        <Route path="/panel-admin" element={
          <ProtectedRoute allowedRoles={['Administrador']}>
            <PanelAdministrativo />
          </ProtectedRoute>
        } />
        <Route path="/usuarios-administrativo" element={
          <ProtectedRoute allowedRoles={['Administrador']}>
            <PanelUsuariosAdministrativo />
          </ProtectedRoute>
        } />
        <Route path="/registrar-usuario-administrativo" element={
          <ProtectedRoute allowedRoles={['Administrador']}>
            <RegistrarUsuario />
          </ProtectedRoute>
        } />
        <Route path="/panel-jefe-directo" element={
          <ProtectedRoute allowedRoles={['JefeDirecto']}>
            <PanelJefeDirecto />
          </ProtectedRoute>
        } />
        <Route path="/registros-horas-extra" element={
          <ProtectedRoute allowedRoles={['JefeDirecto']}>
            <PanelRegistrosHorasExtra />
          </ProtectedRoute>
        } />

        <Route path="/crear-registros-horas-extra" element={
          <ProtectedRoute allowedRoles={['JefeDirecto']}>
            <CrearRegistroHorasExtra />
          </ProtectedRoute>
        } />
        <Route path="/crear-registro-horas" element={
          <ProtectedRoute allowedRoles={['Empleado']}>
            <CrearRegistroHorasEmpleado />
          </ProtectedRoute>
        } />
        <Route path="/tipos-hora" element={
          <ProtectedRoute allowedRoles={['JefeDirecto']}>
            <GestionarTiposHora />
          </ProtectedRoute>
        } />
        <Route path="/usuarios-jefe-directo" element={
          <ProtectedRoute allowedRoles={['JefeDirecto']}>
            <PanelUsuarios />
          </ProtectedRoute>
        } />
        <Route path="/panel-empleado" element={
          <ProtectedRoute allowedRoles={['Empleado']}>
            <PanelEmpleado />
          </ProtectedRoute>
        } />
        <Route path="/mis-registros" element={
          <ProtectedRoute allowedRoles={['Empleado']}>
            <MisRegistros />
          </ProtectedRoute>
        } />
        <Route path="/panel-inventory-manager" element={
          <ProtectedRoute allowedRoles={['InventoryManager']}>
            <PanelInventoryManager />
          </ProtectedRoute>
        } />
        <Route path="/dispositivos" element={
          <ProtectedRoute allowedRoles={['InventoryManager']}>
            <GestionarDispositivos />
          </ProtectedRoute>
        } />
        <Route path="/categorias" element={
          <ProtectedRoute allowedRoles={['InventoryManager']}>
            <GestionarCategorias />
          </ProtectedRoute>
        } />
        <Route path="/sedes" element={
          <ProtectedRoute allowedRoles={['InventoryManager']}>
            <GestionarSedes />
          </ProtectedRoute>
        } />
        <Route path="/reportes-inventario" element={
          <ProtectedRoute allowedRoles={['InventoryManager']}>
            <ReportesInventario />
          </ProtectedRoute>
        } />
        <Route path="/estadisticas-dispositivos" element={
          <ProtectedRoute allowedRoles={['InventoryManager']}>
            <EstadisticasDispositivos />
          </ProtectedRoute>
        } />
        <Route path="/gestionar-registros-horas-extra" element={
          <ProtectedRoute allowedRoles={['SubAdministrador']}>
            <GestionarRegistrosHorasExtra />
          </ProtectedRoute>
        } />
        <Route path="/gestionar-reportes-horas-extra" element={
          <ProtectedRoute allowedRoles={['SubAdministrador']}>
            <GestionReportesHorasExtra />
          </ProtectedRoute>
        } />
        <Route path="/crear-registro-horas-extra-subadmin" element={
          <ProtectedRoute allowedRoles={['SubAdministrador']}>
            <CrearRegistroHorasExtraSubAdmin />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;