const API_BASE_URL = 'http://localhost:3000/api';

export const gestionSedesService = {
  // Obtener todas las sedes
  fetchSedes: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sedes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener sedes:', error);
      throw new Error('No se pudieron cargar las sedes. Verifique su conexión.');
    }
  },

  // Obtener sede por ID
  fetchSedePorId: async (sedeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sedes/${sedeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener sede:', error);
      throw new Error('No se pudo cargar la sede solicitada.');
    }
  },

  // Crear nueva sede
  crearSede: async (sedeData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sedes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(sedeData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al crear sede:', error);
      throw new Error(error.message || 'No se pudo crear la sede.');
    }
  },

  // Actualizar sede
  actualizarSede: async (sedeId, sedeData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sedes/${sedeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(sedeData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al actualizar sede:', error);
      throw new Error(error.message || 'No se pudo actualizar la sede.');
    }
  },

  // Eliminar sede
  eliminarSede: async (sedeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sedes/${sedeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Error al eliminar sede:', error);
      throw new Error(error.message || 'No se pudo eliminar la sede.');
    }
  },

  // Cambiar estado de sede
  cambiarEstadoSede: async (sedeId, estado) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sedes/${sedeId}/estado`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ estado })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al cambiar estado de sede:', error);
      throw new Error(error.message || 'No se pudo cambiar el estado de la sede.');
    }
  },

  // Buscar sedes
  buscarSedes: async (criterios) => {
    try {
      const params = new URLSearchParams(criterios);
      const response = await fetch(`${API_BASE_URL}/sedes/buscar?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al buscar sedes:', error);
      throw new Error('No se pudieron buscar las sedes.');
    }
  },

  // Obtener estadísticas de sede
  obtenerEstadisticasSede: async (sedeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sedes/${sedeId}/estadisticas`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw new Error('No se pudieron cargar las estadísticas de la sede.');
    }
  },

  // Agregar horario a sede
  agregarHorario: async (sedeId, horarioData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sedes/${sedeId}/horarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(horarioData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al agregar horario:', error);
      throw new Error(error.message || 'No se pudo agregar el horario a la sede.');
    }
  },

  // Eliminar horario de sede
  eliminarHorario: async (sedeId, horarioIndex) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sedes/${sedeId}/horarios/${horarioIndex}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Error al eliminar horario:', error);
      throw new Error(error.message || 'No se pudo eliminar el horario de la sede.');
    }
  }
};
