import { useCallback, useEffect, useMemo, useState } from 'react';
import { tiposHoraService } from '../services';

export function useTiposHora() {
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await tiposHoraService.fetchAll();
      setTipos(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || 'Error al cargar tipos de hora');
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return tipos.filter(t => (t.tipo || '').toLowerCase().includes(q) || (t.denominacion || '').toLowerCase().includes(q));
  }, [tipos, search]);

  const create = useCallback(async (payload) => {
    const saved = await tiposHoraService.create(payload);
    await fetchAll();
    return saved;
  }, [fetchAll]);

  const update = useCallback(async (idOrTipo, payload) => {
    const saved = await tiposHoraService.update(idOrTipo, payload);
    await fetchAll();
    return saved;
  }, [fetchAll]);

  const remove = useCallback(async (idOrTipo) => {
    await tiposHoraService.remove(idOrTipo);
    await fetchAll();
  }, [fetchAll]);

  return { tipos, filtered, loading, error, search, setSearch, fetchAll, create, update, remove };
}


