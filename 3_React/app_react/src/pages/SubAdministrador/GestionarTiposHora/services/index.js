const API_BASE_URL = 'http://localhost:3000/api';

export const tiposHoraService = {
  async fetchAll() {
    const res = await fetch(`${API_BASE_URL}/horas`);
    if (!res.ok) throw new Error('Error al cargar tipos de hora');
    return res.json();
  },
  async create(data) {
    const res = await fetch(`${API_BASE_URL}/horas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al crear el tipo de hora');
    return res.json();
  },
  async update(idOrTipo, data) {
    const res = await fetch(`${API_BASE_URL}/horas/${idOrTipo}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al actualizar el tipo de hora');
    return res.json();
  },
  async remove(idOrTipo) {
    const res = await fetch(`${API_BASE_URL}/horas/${idOrTipo}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar el tipo de hora');
    return true;
  }
};


