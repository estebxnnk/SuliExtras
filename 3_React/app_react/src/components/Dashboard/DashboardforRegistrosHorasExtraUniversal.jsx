import React from 'react';
import HeaderUniversal from '../HeaderUniversal';
import LayoutUniversal from '../LayoutUniversal';

function DashboardforRegistrosHorasExtraUniversal({
  title = 'Panel de Sub Administrador',
  subtitle = 'Gestión integral de usuarios y registros del sistema',
  refreshing = false,
  onRefresh,
  children,
  NavbarComponent,
  navbarProps
}) {
  return (
    <LayoutUniversal NavbarComponent={NavbarComponent} navbarProps={navbarProps}>
      <HeaderUniversal
        title={title}
        subtitle={subtitle}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
      {children}
    </LayoutUniversal>
  );
}

export default DashboardforRegistrosHorasExtraUniversal;


