/**
 * Validador Singleton para registros de horas extra
 * Maneja todas las validaciones específicas del método crearRegistrosBulk
 */
class ValidadorRegistro {
  constructor() {
    if (ValidadorRegistro.instance) {
      return ValidadorRegistro.instance;
    }
    ValidadorRegistro.instance = this;
  }

  /**
   * Valida los datos iniciales para creación masiva
   * @param {Array} registrosData - Array de datos de registros
   * @param {number} usuarioId - ID del usuario
   * @returns {Object} Resultado de validación
   */
  validarDatosIniciales(registrosData, usuarioId) {
    const errores = [];

    if (!usuarioId) {
      errores.push('El usuarioId es requerido para crear registros');
    }

    if (!Array.isArray(registrosData) || registrosData.length === 0) {
      errores.push('Se requiere un array de datos de registros no vacío');
    }

    return {
      esValido: errores.length === 0,
      errores
    };
  }

  /**
   * Valida un registro individual
   * @param {Object} registroData - Datos del registro
   * @param {number} indice - Índice del registro
   * @param {boolean} validarHorarios - Si debe validar horarios
   * @returns {Object} Resultado de validación
   */
  validarRegistroIndividual(registroData, indice, validarHorarios = true) {
    const errores = [];

    if (validarHorarios) {
      if (!registroData.horaIngreso || !registroData.horaSalida) {
        errores.push(`Registro ${indice + 1}: horaIngreso y horaSalida son requeridas`);
      }
      
      if (!registroData.fecha) {
        errores.push(`Registro ${indice + 1}: fecha es requerida`);
      }
      
      // Validar formato de horas
      const ingresoMin = this.convertirHoraAMinutos(registroData.horaIngreso);
      const salidaMin = this.convertirHoraAMinutos(registroData.horaSalida);
      
      if (ingresoMin === null || salidaMin === null) {
        errores.push(`Registro ${indice + 1}: formato de hora inválido (use HH:MM)`);
      }
    }

    return {
      esValido: errores.length === 0,
      errores
    };
  }

  /**
   * Convierte una hora en formato HH:MM a minutos
   * @param {string} hora - Hora en formato HH:MM
   * @returns {number|null} Minutos o null si el formato es inválido
   */
  convertirHoraAMinutos(hora) {
    if (!hora || typeof hora !== 'string') return null;
    const [h, m] = hora.split(':').map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    return h * 60 + m;
  }

  /**
   * Genera mensaje de error para múltiples errores de validación
   * @param {Array} erroresValidacion - Array de errores
   * @returns {string} Mensaje de error formateado
   */
  generarMensajeErrores(erroresValidacion) {
    return `Errores de validación en ${erroresValidacion.length} registro(s):\n` +
           erroresValidacion.map(e => `- Registro ${e.indice}: ${e.error}`).join('\n');
  }
}

module.exports = new ValidadorRegistro();
