const API_BASE_URL = 'http://localhost:3000/api';

export const registrosHorasExtraService = {
  async createRegistrosBulk(payload) {
    const response = await fetch(`${API_BASE_URL}/registros/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al crear los registros');
    }
    return response.json();
  },
  async getTiposHora() {
    const response = await fetch(`${API_BASE_URL}/horas`);
    if (!response.ok) throw new Error('Error al obtener tipos de hora');
    return response.json();
  },
  async getUsuarios() {
    const response = await fetch(`${API_BASE_URL}/usuarios`);
    if (!response.ok) throw new Error('Error al obtener usuarios');
    return response.json();
  }
};


