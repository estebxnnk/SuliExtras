import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavbarUniversal, SidebarUniversal } from '../../components';

function NavbarSubAdmin() {
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
    { key: 'usuarios', label: 'Usuarios', to: '/usuarios' },
    { key: 'crear', label: 'Crear Usuario', to: '/registrar-usuario' },
    { key: 'solicitudes', label: 'Solicitudes', to: '/panel-sub-admin?tab=solicitudes' },
    { key: 'registros', label: 'Registros de horas extra', to: '/gestionar-registros-horas-extra' },
    { key: 'reportes', label: 'Reportes de horas extra', to: '/gestionar-reportes-horas-extra' },
    { key: 'tipos', label: 'Tipos de hora', to: '/gestionar-tipos-hora-subadmin' },
  ];

  // Derivar pestaña activa desde la URL
  const activeKey = (() => {
    const path = window.location.pathname;
    const search = window.location.search;
    if (path.includes('/usuarios')) return 'usuarios';
    if (path.includes('/registrar-usuario')) return 'crear';
    if (path.includes('/gestionar-registros-horas-extra')) return 'registros';
    if (path.includes('/gestionar-reportes-horas-extra')) return 'reportes';
    if (path.includes('/gestionar-tipos-hora-subadmin')) return 'tipos';
    if (search.includes('tab=solicitudes')) return 'solicitudes';
    return undefined;
  })();

  return (
    <>
      <NavbarUniversal
        title="Panel Sub-Administrador"
        items={items}
        activeKey={activeKey}
        activeLabel={items.find(i => i.key === activeKey)?.label}
        user={{
          name: userData ? `${userData.persona?.nombres || ''} ${userData.persona?.apellidos || ''}` : undefined,
          email: userData?.email,
          role: userData?.rol?.nombre,
        }}
        onLogout={handleLogout}
        onMenuToggle={() => setOpenSidebar(true)}
      />
      <SidebarUniversal open={openSidebar} onClose={() => setOpenSidebar(false)} items={items} header="Navegación" activeKey={activeKey} />
    </>
  );
}

export default NavbarSubAdmin; 