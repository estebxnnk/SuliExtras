import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { NavbarUniversal, SidebarUniversal } from '../../components';

function NavbarEmpleado() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [openSidebar, setOpenSidebar] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`http://localhost:3000/api/usuarios/${userId}`)
        .then(async (res) => {
          if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new Error(`GET /usuarios/${userId} -> ${res.status}. ${text}`);
          }
          return res.json();
        })
        .then(data => setUserData(data))
        .catch((err) => {
          console.error('Error cargando usuario actual:', err);
          setUserData(null);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRol');
    navigate('/');
  };

  const items = [
    { key: 'panel', label: 'Panel', to: '/panel-empleado' },
    { key: 'mis', label: 'Mis Registros', to: '/mis-registros' },
    { key: 'gestionar', label: 'Gestionar Registros', to: '/gestionar-registros-empleado' },
    { key: 'crear', label: 'Crear Registro', to: '/crear-registro-horas' }
  ];

  const activeKey = (() => {
    const path = window.location.pathname;
    if (path.includes('/panel-empleado')) return 'panel';
    if (path.includes('/mis-registros')) return 'mis';
    if (path.includes('/gestionar-registros-empleado')) return 'gestionar';
    if (path.includes('/crear-registro-horas')) return 'crear';
    return undefined;
  })();

  return (
    <>
      <NavbarUniversal
        title="Panel Empleado"
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

export default NavbarEmpleado;