import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => (
  <div className="barra-nav">
    <div className="navegacion">
      <Link to="/"><img className="logo-suli" src="/img/NuevoLogo.png" alt="Logo" /></Link>
      <div className="nosotros">Nosotros</div>
      <div className="objetivos">Objetivos</div>
      <div className="manual">Manual de Usuario</div>
    </div>
    <div className="botones-superiores">
      <Link to="/login">
        <div className="contactanos-verde">
          <div className="texto">Iniciar Sesión</div>
          <div className="vector"></div>
        </div>
      </Link>
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