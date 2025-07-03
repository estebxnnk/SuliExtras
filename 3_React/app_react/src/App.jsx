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
      </Routes>
    </Router>
  );
}

export default App;