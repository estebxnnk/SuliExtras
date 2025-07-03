import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onLoginClick }) => (
  <div className="barra-nav">
    <div className="navegacion">
      <Link to="/"><img className="logo-suli" src="/img/NuevoLogo.png" alt="Logo" /></Link>
      <div className="nosotros">Nosotros</div>
      <div className="objetivos">Objetivos</div>
      <div className="manual">Manual de Usuario</div>
    </div>
    <div className="botones-superiores">
      <div className="contactanos-verde" onClick={onLoginClick} style={{ cursor: 'pointer' }}>
        <div className="texto">Iniciar Sesión</div>
        <div className="vector"></div>
      </div>
      <Link to="/contactanos">
        <div className="contactanos-negro">
          <div className="texto">Contáctanos</div>
          <div className="vector"></div>
        </div>
      </Link>
    </div>
  </div>
);

export default Navbar;