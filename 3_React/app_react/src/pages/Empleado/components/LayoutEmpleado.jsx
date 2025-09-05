import React from 'react';
import { LayoutUniversal } from '../../../components';
import NavbarEmpleado from '../NavbarEmpleado';

const LayoutEmpleado = ({ children, ...props }) => {
  return (
    <LayoutUniversal showNavbar={false} {...props}>
      <NavbarEmpleado />
      <main style={{ marginTop: '100px' }}>
        {children}
      </main>
    </LayoutUniversal>
  );
};

export default LayoutEmpleado;


