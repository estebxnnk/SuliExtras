import { useEffect, useMemo, useState, useCallback } from 'react';
import { subAdminService } from '../../pages/SubAdministrador/PanelSubAdmin/services/subAdminService';

/**
 * Hook universal para manejar filtros de usuarios (búsqueda, rol, sede)
 * - Recibe usuarios y (opcional) roles iniciales
 * - Expone estados/controladores y la lista filtrada
 */
export default function useUserFiltersUniversal(initialUsers = [], initialRoles = []) {
  const [users, setUsers] = useState(initialUsers);
  const [roles, setRoles] = useState(initialRoles);

  const [search, setSearch] = useState('');
  const [roleId, setRoleId] = useState('');
  const [sedeId, setSedeId] = useState('');

  // Sincronizar cuando cambien los props
  useEffect(() => { setUsers(initialUsers); }, [initialUsers]);
  useEffect(() => { setRoles(initialRoles); }, [initialRoles]);

  // Cargar roles si no vienen
  useEffect(() => {
    if (roles && roles.length > 0) return;
    let active = true;
    (async () => {
      try {
        const fetched = await subAdminService.fetchRoles();
        if (active) setRoles(Array.isArray(fetched) ? fetched : []);
      } catch (e) { /* noop */ }
    })();
    return () => { active = false; };
  }, []); // una sola vez

  // Opciones de sedes a partir de los usuarios
  const sedes = useMemo(() => {
    const map = new Map();
    users.forEach(u => {
      const id = u.sede?.id || u.sedeId || u.sede?.nombre || '';
      const nombre = u.sede?.nombre || (typeof u.sede === 'string' ? u.sede : '') || 'No asignada';
      if (!id) return;
      if (!map.has(String(id))) map.set(String(id), { id: String(id), nombre });
    });
    return Array.from(map.values());
  }, [users]);

  // Filtrado
  const filteredUsers = useMemo(() => {
    const q = (search || '').toLowerCase();
    return users.filter(u => {
      // search por nombre, email o documento
      const nombre = `${u.persona?.nombres || ''} ${u.persona?.apellidos || ''}`.toLowerCase();
      const email = (u.email || '').toLowerCase();
      const documento = (u.persona?.numeroDocumento || '').toLowerCase();
      const matchSearch = !q || nombre.includes(q) || email.includes(q) || documento.includes(q);

      // rol
      const uRolId = String(u.rol?.id || '');
      const uRolNombre = (u.rol?.nombre || '').toLowerCase();
      const roleIdStr = String(roleId ?? '');
      const roleMatch = !roleIdStr || roleIdStr === uRolId || roleIdStr.toLowerCase() === uRolNombre;

      // sede
      const uSedeId = String(u.sede?.id || u.sedeId || u.sede?.nombre || '');
      const sedeIdStr = String(sedeId ?? '');
      const sedeMatch = !sedeIdStr || sedeIdStr === uSedeId;

      return matchSearch && roleMatch && sedeMatch;
    });
  }, [users, search, roleId, sedeId]);

  // Helpers para exponer tamaño
  const getCountAfterFilter = useCallback(() => filteredUsers.length, [filteredUsers]);

  return {
    // estados
    search, setSearch,
    roleId, setRoleId,
    sedeId, setSedeId,
    // opciones
    roleOptions: roles,
    sedeOptions: sedes,
    // datos
    filteredUsers,
    getCountAfterFilter
  };
}


