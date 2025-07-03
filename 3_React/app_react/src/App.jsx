import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
        <Route path="/panel-sub-admin" element={<PanelSubAdmin />} />
        <Route path="/registrar-usuario" element={<RegistrarUsuarioSubAdmin />} />
        <Route path="/usuarios" element={<PanelUsuariosSubAdmin />} />
        <Route path="/usuarios-administrativo" element={<PanelUsuariosAdministrativo />} />
        <Route path="/registrar-usuario-administrativo" element={<RegistrarUsuario />} />
        <Route path='//panel-admin-administrativo' element={<PanelAdministrativo/>} />

      </Routes>
    </Router>
  );
}

export default App;