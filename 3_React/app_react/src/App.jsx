import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Contactanos from './pages/Contactanos';
import Login from './pages/Login';
import PanelAdmin from './pages/Administrador/PanelAdmin';
import RegistrarUsuario from './pages/RegistrarUsuario';
import PanelUsuarios from './pages/PanelUsuarios';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contactanos" element={<Contactanos />} />
        <Route path="/panel-admin" element={<PanelAdmin />} />
        <Route path="/registrar-usuario" element={<RegistrarUsuario />} />
        <Route path="/usuarios" element={<PanelUsuarios />} />
      </Routes>
    </Router>
  );
}

export default App;