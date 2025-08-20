const API_BASE_URL = 'http://localhost:3000/api';

export const gestionReportesService = {
  // Obtener lista de usuarios
  async fetchUsuarios() {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios`);
      if (!response.ok) {
        throw new Error('Error al obtener usuarios');
      }
      const data = await response.json();
      // Ordenar por fecha de creación descendente
      return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      console.error('Error en fetchUsuarios:', error);
      throw error;
    }
  },

  // Obtener registros de horas extra de un usuario
  async fetchRegistrosUsuario(usuarioId) {
    try {
      const response = await fetch(`${API_BASE_URL}/registros/usuario-completo/${usuarioId}`);
      if (!response.ok) {
        throw new Error('Error al obtener registros del usuario');
      }
      const data = await response.json();
      return Array.isArray(data.registros) ? data.registros : [];
    } catch (error) {
      console.error('Error en fetchRegistrosUsuario:', error);
      throw error;
    }
  },

  // Obtener registros aprobados para reporte
  async fetchRegistrosAprobados(usuarioId) {
    try {
      const registros = await this.fetchRegistrosUsuario(usuarioId);
      return registros.filter(r => r.estado === 'aprobado');
    } catch (error) {
      console.error('Error en fetchRegistrosAprobados:', error);
      throw error;
    }
  }
};
