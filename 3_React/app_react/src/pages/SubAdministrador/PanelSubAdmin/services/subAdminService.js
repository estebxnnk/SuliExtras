// Configuración de la API
const API_BASE_URL = 'http://localhost:3000/api';

class SubAdminService {
  // Obtener todos los usuarios
  async fetchUsuarios() {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios`);
      if (!response.ok) {
        throw new Error('Error al cargar usuarios');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching usuarios:', error);
      throw error;
    }
  }

  // Obtener todos los roles
  async fetchRoles() {
    try {
      const response = await fetch(`${API_BASE_URL}/roles`);
      if (!response.ok) {
        throw new Error('Error al cargar roles');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  }

  // Obtener todos los registros
  async fetchRegistros() {
    try {
      const response = await fetch(`${API_BASE_URL}/registros`);
      if (!response.ok) {
        throw new Error('Error al cargar registros');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching registros:', error);
      throw error;
    }
  }

  // Obtener registros de un usuario específico
  async fetchRegistrosUsuario(usuarioId) {
    try {
      const response = await fetch(`${API_BASE_URL}/registros/usuario-completo/${usuarioId}`);
      if (!response.ok) {
        throw new Error('Error al cargar registros del usuario');
      }
      const data = await response.json();
      return Array.isArray(data.registros) ? data.registros : [];
    } catch (error) {
      console.error('Error fetching registros usuario:', error);
      throw error;
    }
  }

  // Crear un nuevo usuario
  async createUsuario(usuarioData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuarioData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating usuario:', error);
      throw error;
    }
  }

  // Actualizar un usuario existente
  async updateUsuario(usuarioId, usuarioData) {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${usuarioId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuarioData)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating usuario:', error);
      throw error;
    }
  }

  // Eliminar un usuario
  async deleteUsuario(usuarioId) {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${usuarioId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el usuario');
      }

      return true;
    } catch (error) {
      console.error('Error deleting usuario:', error);
      throw error;
    }
  }

  // Crear un nuevo rol
  async createRol(rolData) {
    try {
      const response = await fetch(`${API_BASE_URL}/roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rolData)
      });

      if (!response.ok) {
        throw new Error('Error al crear el rol');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating rol:', error);
      throw error;
    }
  }

  // Cambiar rol de un usuario
  async cambiarRolUsuario(usuarioId, nuevoRolId) {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${usuarioId}/rol`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rolId: nuevoRolId })
      });

      if (!response.ok) {
        throw new Error('Error al cambiar el rol del usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error changing user role:', error);
      throw error;
    }
  }
}

export const subAdminService = new SubAdminService(); 