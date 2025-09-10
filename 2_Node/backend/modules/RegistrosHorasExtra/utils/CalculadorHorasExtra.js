const SedeLogic = require('../../../logic/SedeLogic');

/**
 * Calculador Singleton para horas extra
 * Maneja todos los cálculos relacionados con horas extra del método crearRegistrosBulk
 */
class CalculadorHorasExtra {
  constructor() {
    if (CalculadorHorasExtra.instance) {
      return CalculadorHorasExtra.instance;
    }
    CalculadorHorasExtra.instance = this;
  }

  /**
   * Obtiene la sede del usuario para cálculos
   * @param {number} usuarioId - ID del usuario
   * @returns {Promise<Object|null>} Sede del usuario o null
   */
  async obtenerSedeUsuario(usuarioId) {
    try {
      const info = await SedeLogic.obtenerSedePorUsuario(usuarioId);
      return info?.sede || null;
    } catch (error) {
      console.warn('No se pudo obtener la sede del usuario:', error.message);
      return null;
    }
  }

  /**
   * Calcula las horas extra según la configuración
   * @param {string} horaSalida - Hora de salida del registro
   * @param {number} cantidadEntrada - Cantidad manual de horas extra
   * @param {Object} sedeUsuario - Sede del usuario
   * @param {boolean} calcularAutomaticamente - Si calcular automáticamente
   * @returns {number} Cantidad de horas extra calculadas
   */
  calcularHorasExtra(horaSalida, cantidadEntrada, sedeUsuario, calcularAutomaticamente) {
    if (calcularAutomaticamente && sedeUsuario) {
      return this.calcularHorasExtraSegunSede(horaSalida, sedeUsuario);
    } else if (cantidadEntrada !== undefined) {
      return Number(cantidadEntrada) || 0;
    }
    return 0;
  }

  /**
   * Calcula horas extra basándose en el horario de la sede
   * @param {string} horaSalidaRegistro - Hora de salida del registro
   * @param {Object} sede - Información de la sede
   * @returns {number} Horas extra calculadas
   */
  calcularHorasExtraSegunSede(horaSalidaRegistro, sede) {
    if (!sede) return 0;
    
    const horario = this.seleccionarHorarioActivoPrincipal(sede.horarios || []);
    if (!horario) return 0;
    
    const salidaRegMin = this.convertirHoraAMinutos(horaSalidaRegistro);
    const salidaHorMin = this.convertirHoraAMinutos(horario.horaSalida);
    
    if (salidaRegMin === null || salidaHorMin === null) return 0;
    
    // Si la hora de salida del registro sobrepasa la del horario de sede, contar excedente
    const excedente = Math.max(0, salidaRegMin - salidaHorMin);
    return parseFloat((excedente / 60).toFixed(2));
  }

  /**
   * Selecciona el horario activo principal de una sede
   * @param {Array} horarios - Array de horarios de la sede
   * @returns {Object|null} Horario seleccionado
   */
  seleccionarHorarioActivoPrincipal(horarios) {
    if (!Array.isArray(horarios) || horarios.length === 0) return null;
    
    const activos = horarios.filter(h => h && h.activo);
    const lista = activos.length > 0 ? activos : horarios;
    
    // Escoger el que tenga mayor horaSalida en minutos (máximo final de jornada)
    let seleccionado = null;
    let maxSalida = -1;
    
    for (const h of lista) {
      const salidaMin = this.convertirHoraAMinutos(h.horaSalida);
      if (salidaMin !== null && salidaMin > maxSalida) {
        seleccionado = h;
        maxSalida = salidaMin;
      }
    }
    
    return seleccionado;
  }

  /**
   * Divide las horas extra en campos reportables
   * @param {number} cantidad - Cantidad total de horas extra
   * @returns {Object} División de horas extra
   */
  dividirHorasExtra(cantidad) {
    const horas_extra_divididas = Math.min(2, cantidad);
    const bono_salarial = cantidad > 2 ? cantidad - 2 : 0;
    const cantidadHorasExtra = cantidad; // Horas reales
    return { horas_extra_divididas, bono_salarial, cantidadHorasExtra };
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
}

module.exports = new CalculadorHorasExtra();
