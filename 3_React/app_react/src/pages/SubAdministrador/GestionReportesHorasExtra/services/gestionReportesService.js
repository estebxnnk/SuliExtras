const API_BASE_URL = 'http://localhost:3000/api';

export const gestionReportesService = {
  /**
   * Obtiene la lista de usuarios del sistema
   * @returns {Promise<Array>} Lista de usuarios
   */
  async fetchUsuarios() {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Ordenar por fecha de creación descendente
      return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      console.error('Error fetching usuarios:', error);
      throw error;
    }
  },

  /**
   * Obtiene los registros completos de un usuario específico
   * @param {number} usuarioId - ID del usuario
   * @returns {Promise<Object>} Datos del usuario con sus registros
   */
  async fetchRegistrosUsuario(usuarioId) {
    try {
      const response = await fetch(`${API_BASE_URL}/registros/usuario-completo/${usuarioId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data.registros) ? data.registros : [];
    } catch (error) {
      console.error('Error fetching registros usuario:', error);
      throw error;
    }
  },

  /**
   * Obtiene solo los registros aprobados de un usuario para generar reportes
   * @param {number} usuarioId - ID del usuario
   * @returns {Promise<Array>} Lista de registros aprobados
   */
  async fetchRegistrosAprobados(usuarioId) {
    try {
      const registros = await this.fetchRegistrosUsuario(usuarioId);
      return registros.filter(registro => registro.estado === 'aprobado');
    } catch (error) {
      console.error('Error fetching registros aprobados:', error);
      throw error;
    }
  },

  /**
   * Calcula el reporte de horas extra para un usuario
   * @param {Array} registros - Lista de registros aprobados
   * @param {number} salarioMinimo - Salario mínimo vigente
   * @returns {Object} Datos del reporte calculado
   */
  calcularReporte(registros, salarioMinimo) {
    const valorHoraOrdinaria = salarioMinimo / 240;
    let totalHorasDivididas = 0;
    let totalPagarDivididas = 0;
    let totalHorasBono = 0;
    let totalPagarBono = 0;
    let detalles = [];

    registros.forEach(registro => {
      const cantidadDividida = registro.horas_extra_divididas ?? 0;
      const cantidadBono = registro.bono_salarial ?? 0;

      if (Array.isArray(registro.Horas) && registro.Horas.length > 0) {
        registro.Horas.forEach((hora, index) => {
          const recargo = hora.valor;
          const valorHoraExtra = valorHoraOrdinaria * recargo;
          const valorTotalDivididas = cantidadDividida * valorHoraExtra;

          totalHorasDivididas += cantidadDividida;
          totalPagarDivididas += valorTotalDivididas;

          const bonoEnFila = index === 0 ? cantidadBono : 0;
          const valorTotalBono = bonoEnFila * valorHoraExtra;
          totalHorasBono += bonoEnFila;
          totalPagarBono += valorTotalBono;

          detalles.push({
            fecha: registro.fecha,
            tipo: hora.tipo,
            denominacion: hora.denominacion,
            cantidadDividida,
            valorTotalDivididas: Number(valorTotalDivididas.toFixed(2)),
            cantidadBono: bonoEnFila,
            valorTotalBono: Number(valorTotalBono.toFixed(2)),
            recargo,
            valorHoraExtra: Number(valorHoraExtra.toFixed(2)),
            registroOriginal: registro
          });
        });
      } else if ((cantidadBono ?? 0) > 0) {
        // Sin horas asignadas: representar el bono como fila única sin recargo
        const valorTotalBono = cantidadBono * valorHoraOrdinaria;
        totalHorasBono += cantidadBono;
        totalPagarBono += valorTotalBono;
        detalles.push({
          fecha: registro.fecha,
          tipo: 'Bono Salarial',
          denominacion: '-',
          cantidadDividida: 0,
          valorTotalDivididas: 0,
          cantidadBono,
          valorTotalBono: Number(valorTotalBono.toFixed(2)),
          recargo: 1,
          valorHoraExtra: Number(valorHoraOrdinaria.toFixed(2)),
          registroOriginal: registro
        });
      }
    });

    return {
      totalHorasDivididas,
      totalPagarDivididas,
      totalHorasBono,
      totalPagarBono,
      totalPagar: totalPagarDivididas + totalPagarBono,
      detalles
    };
  }
};
