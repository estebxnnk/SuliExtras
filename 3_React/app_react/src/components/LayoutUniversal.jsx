import React from 'react';
import {
  Box,
  Paper
} from '@mui/material';
import NavbarUniversal from './NavbarUniversal';

/**
 * Layout universal que se basa 100% en el estilo del módulo GestionarRegistrosHorasExtra
 * Mantiene la misma estética visual y estructura
 */
const LayoutUniversal = ({ 
  children,
  backgroundImage = "/img/Recepcion.jpg",
  maxWidth = 1400,
  showNavbar = true
}) => {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      width: '100vw',
      background: `url('${backgroundImage}') no-repeat center center`, 
      backgroundSize: 'cover',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Navbar */}
      {showNavbar && <NavbarUniversal />}
      
      {/* Contenedor principal con el mismo estilo */}
      <Paper elevation={8} sx={{ 
        borderRadius: 4, 
        p: 4,
        margin: showNavbar ? '120px auto 40px auto' : '40px auto',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(240,248,255,0.98) 100%)',
        border: '1px solid rgba(25, 118, 210, 0.2)',
        position: 'relative',
        backdropFilter: 'blur(10px)',
        width: '95vw',
        maxWidth: maxWidth,
        overflow: 'hidden'
      }}>
        {children}
      </Paper>
    </Box>
  );
};

export default LayoutUniversal;
