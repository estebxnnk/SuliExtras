const API_BASE_URL = 'http://localhost:3000/api';

export const usuariosService = {
  // Obtener todas las sedes
  fetchSedes: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sedes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener sedes:', error);
      throw new Error('No se pudieron cargar las sedes.');
    }
  },

  // Actualizar sede de usuario
  actualizarSedeUsuario: async (usuarioId, sedeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${usuarioId}/sede`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sedeId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al actualizar sede del usuario:', error);
      throw new Error(error.message || 'No se pudo actualizar la sede del usuario.');
    }
  }
};
