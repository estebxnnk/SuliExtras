import React from 'react';
import { LayoutUniversal } from '../../../components';
import NavbarAdminstrativo from '../NavbarAdminstrativo';

const LayoutAdministrador = ({ children, ...props }) => {
  return (
    <LayoutUniversal showNavbar={false} {...props}>
      <NavbarAdminstrativo />
      <main style={{ marginTop: '100px' }}>
        {children}
      </main>
    </LayoutUniversal>
  );
};

export default LayoutAdministrador;
