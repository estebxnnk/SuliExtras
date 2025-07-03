import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

//Home
import Home from './pages/Home';
import Contactanos from './pages/Contactanos';
import Login from './pages/Login';

//Rol Sub Administrador
import PanelSubAdmin from './pages/SubAdministrador/PanelSubAdmin';
import RegistrarUsuarioSubAdmin from './pages/SubAdministrador/RegistrarUsuarioSubAdmin';
import PanelUsuariosSubAdmin from './pages/SubAdministrador/PanelUsuariosSubAdmin';

//Rol Administrador
import PanelAdministrativo from './pages/Administrador/PanelAdministrativo';
import PanelUsuariosAdministrativo from './pages/Administrador/PanelUsuariosAdministrativo';
import RegistrarUsuario from './pages/Administrador/RegistrarUsuario';

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
        <Route path="/panel-admin-administrativo" element={
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
      </Routes>
    </Router>
  );
}

export default App;