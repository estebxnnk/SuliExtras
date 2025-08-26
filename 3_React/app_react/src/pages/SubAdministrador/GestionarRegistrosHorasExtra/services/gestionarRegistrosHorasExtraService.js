const API_BASE_URL = 'http://localhost:3000/api';

export const gestionarRegistrosHorasExtraService = {
  // Obtener todos los registros de horas extra
  async getRegistros() {
    try {
      const response = await fetch(`${API_BASE_URL}/registros`);
      if (!response.ok) {
        throw new Error('Error al obtener registros');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getRegistros:', error);
      throw error;
    }
  },

  // Obtener tipos de hora
  async getTiposHora() {
    try {
      const response = await fetch(`${API_BASE_URL}/horas`);
      if (!response.ok) {
        throw new Error('Error al obtener tipos de hora');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getTiposHora:', error);
      throw error;
    }
  },

  // Obtener usuarios
  async getUsuarios() {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios`);
      if (!response.ok) {
        throw new Error('Error al obtener usuarios');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getUsuarios:', error);
      throw error;
    }
  },

  // Actualizar un registro
  async updateRegistro(id, data) {
    try {
      const response = await fetch(`${API_BASE_URL}/registros/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al actualizar el registro');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en updateRegistro:', error);
      throw error;
    }
  },

  // Eliminar un registro
  async deleteRegistro(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/registros/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al eliminar el registro');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en deleteRegistro:', error);
      throw error;
    }
  },

  // Crear un nuevo registro
  async createRegistro(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/registros/dividir-horas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al crear el registro');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en createRegistro:', error);
      throw error;
    }
  },

  // Crear múltiples registros (bulk)
  async createRegistrosBulk(payload) {
    try {
      const response = await fetch(`${API_BASE_URL}/registros/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al crear los registros');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en createRegistrosBulk:', error);
      throw error;
    }
  },

  // Obtener un registro específico por ID
  async getRegistroById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/registros/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener el registro');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getRegistroById:', error);
      throw error;
    }
  },

  // Aprobar un registro
  async aprobarRegistro(id) {
    return this.updateRegistro(id, { estado: 'aprobado' });
  },

  // Rechazar un registro
  async rechazarRegistro(id) {
    return this.updateRegistro(id, { estado: 'rechazado' });
  },

  // Cambiar estado de un registro
  async cambiarEstadoRegistro(id, nuevoEstado) {
    return this.updateRegistro(id, { estado: nuevoEstado });
  }
}; 