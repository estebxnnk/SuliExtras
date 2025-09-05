import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavbarUniversal, SidebarUniversal } from '../../components';

function NavbarAdminstrativo() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [openSidebar, setOpenSidebar] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`http://localhost:3000/api/usuarios/${userId}`)
        .then(res => res.json())
        .then(data => setUserData(data))
        .catch(() => setUserData(null));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRol');
    navigate('/');
  };

  const items = [
    { key: 'dashboard', label: 'Dashboard', to: '/panel-admin' },
    { key: 'usuarios', label: 'Usuarios', to: '/usuarios-administrativo' },
    { key: 'sedes', label: 'Gestionar Sedes', to: '/gestion-sedes' },
    { key: 'solicitudes', label: 'Solicitudes', to: '/panel-admin?tab=solicitudes' },
  ];

  // Derive active tab from URL
  const activeKey = (() => {
    const path = window.location.pathname;
    const search = window.location.search;

    if (path.includes('/usuarios-administrativo')) return 'usuarios';
    if (path.includes('/gestion-sedes')) return 'sedes';
    if (search.includes('tab=solicitudes')) return 'solicitudes';
    if (path.includes('/panel-admin')) return 'dashboard';
    
    return 'dashboard';
  })();

  return (
    <>
      <NavbarUniversal
        title="Panel Administrativo"
        items={items}
        activeKey={activeKey}
        activeLabel={items.find(i => i.key === activeKey)?.label}
        user={{
          name: userData ? `${userData.persona?.nombres || ''} ${userData.persona?.apellidos || ''}` : 'Administrador',
          email: userData?.email,
          role: userData?.rol?.nombre || 'Admin',
        }}
        onLogout={handleLogout}
        onMenuToggle={() => setOpenSidebar(true)}
      />
      <SidebarUniversal 
        open={openSidebar} 
        onClose={() => setOpenSidebar(false)} 
        items={items} 
        header="Navegación Admin"
        activeKey={activeKey} 
      />
    </>
  );
}

export default NavbarAdminstrativo; 