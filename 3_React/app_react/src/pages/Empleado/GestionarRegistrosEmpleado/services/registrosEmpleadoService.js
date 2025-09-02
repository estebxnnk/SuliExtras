const API_BASE_URL = 'http://localhost:3000/api';

export const registrosEmpleadoService = {
  async fetchRegistros() {
    const response = await fetch(`${API_BASE_URL}/registros`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  },

  async fetchTiposHora() {
    const response = await fetch(`${API_BASE_URL}/horas`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  },

  async updateRegistro(id, payload) {
    const response = await fetch(`${API_BASE_URL}/registros/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  async deleteRegistro(id) {
    const response = await fetch(`${API_BASE_URL}/registros/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return true;
  }
};


