// Configuración de la API
const API_BASE_URL = 'http://localhost:8080/api';

class DispositivosService {
  // Obtener todos los dispositivos
  async fetchDispositivos() {
    try {
      const response = await fetch(`${API_BASE_URL}/dispositivos`);
      if (!response.ok) {
        throw new Error('Error al cargar dispositivos');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching dispositivos:', error);
      throw error;
    }
  }

  // Obtener todas las sedes
  async fetchSedes() {
    try {
      const response = await fetch(`${API_BASE_URL}/sedes`);
      if (!response.ok) {
        throw new Error('Error al cargar sedes');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching sedes:', error);
      throw error;
    }
  }

  // Obtener todos los empleados
  async fetchEmpleados() {
    try {
      const response = await fetch(`${API_BASE_URL}/empleados`);
      if (!response.ok) {
        throw new Error('Error al cargar empleados');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching empleados:', error);
      throw error;
    }
  }

  // Obtener asignaciones de un dispositivo
  async fetchAsignaciones(dispositivoId) {
    try {
      const response = await fetch(`${API_BASE_URL}/asignaciones/dispositivo/${dispositivoId}`);
      if (!response.ok) {
        throw new Error('Error al cargar las asignaciones');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching asignaciones:', error);
      throw error;
    }
  }

  // Crear un nuevo dispositivo
  async createDispositivo(dispositivoData) {
    try {
      const response = await fetch(`${API_BASE_URL}/dispositivos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dispositivoData)
      });

      if (!response.ok) {
        throw new Error('Error al crear el dispositivo');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating dispositivo:', error);
      throw error;
    }
  }

  // Actualizar un dispositivo existente
  async updateDispositivo(dispositivoId, dispositivoData) {
    try {
      const response = await fetch(`${API_BASE_URL}/dispositivos/${dispositivoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dispositivoData)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el dispositivo');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating dispositivo:', error);
      throw error;
    }
  }

  // Eliminar un dispositivo
  async deleteDispositivo(dispositivoId) {
    try {
      const response = await fetch(`${API_BASE_URL}/dispositivos/${dispositivoId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el dispositivo');
      }

      return true;
    } catch (error) {
      console.error('Error deleting dispositivo:', error);
      throw error;
    }
  }
}

export const dispositivosService = new DispositivosService(); 