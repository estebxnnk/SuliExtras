import React from 'react';
import HeaderUniversal from '../HeaderUniversal';
import LayoutUniversal from '../LayoutUniversal';

function SubAdminDashboard({
  title = 'Panel de Sub Administrador',
  subtitle = 'Gestión integral de usuarios y registros del sistema',
  refreshing = false,
  onRefresh,
  children
}) {
  return (
    <LayoutUniversal>
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

export default SubAdminDashboard;


