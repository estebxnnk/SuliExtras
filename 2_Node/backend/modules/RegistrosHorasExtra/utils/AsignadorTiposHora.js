const HoraLogic = require('../../../logic/HoraLogic');

/**
 * Asignador Singleton para tipos de hora
 * Maneja la asignación automática de tipos de hora del método crearRegistrosBulk
 */
class AsignadorTiposHora {
  constructor() {
    if (AsignadorTiposHora.instance) {
      return AsignadorTiposHora.instance;
    }
    AsignadorTiposHora.instance = this;
  }

  /**
   * Asocia horas según condiciones específicas
   * @param {Object} registro - Registro creado
   * @param {string} horaIngreso - Hora de ingreso
   * @param {string} horaSalida - Hora de salida
   * @param {string} fecha - Fecha del registro
   * @param {number} cantidadHorasExtra - Cantidad de horas extra
   * @param {number} horasExtraDivididas - Horas extra divididas
   * @param {Object} transaction - Transacción de base de datos
   * @returns {Promise<Array>} Asociaciones creadas
   */
  async asociarHorasSegunCondiciones(registro, horaIngreso, horaSalida, fecha, cantidadHorasExtra, horasExtraDivididas, transaction = null) {
    const asociaciones = [];
    
    try {
      // 1. Asignar horas extra si existen
      if (cantidadHorasExtra > 0 && horasExtraDivididas > 0) {
        const asociacionExtra = await this.asignarHoraAutomaticamente(
          registro, horaIngreso, horaSalida, fecha, horasExtraDivididas, true, transaction
        );
        if (asociacionExtra) {
          asociaciones.push(asociacionExtra);
        }
      }
      
      // 2. Asignar recargos para horario regular si aplica
      const salidaMin = this.convertirHoraAMinutos(horaSalida);
      const esFestivo = this.esFechaFestiva(fecha);
      const esNocturno = salidaMin >= 1080; // Después de las 18:00
      
      // Solo asignar recargos si es festivo o nocturno
      if (esFestivo || esNocturno) {
        // Calcular horas de trabajo regular (sin horas extra)
        const horasRegulares = Math.max(0, 8 - cantidadHorasExtra); // Asumiendo jornada de 8 horas
        
        if (horasRegulares > 0) {
          const asociacionRecargo = await this.asignarHoraAutomaticamente(
            registro, horaIngreso, horaSalida, fecha, horasRegulares, false, transaction
          );
          if (asociacionRecargo) {
            asociaciones.push(asociacionRecargo);
          }
        }
      }
      
      return asociaciones;
    } catch (error) {
      console.error('Error en asociarHorasSegunCondiciones:', error);
      return asociaciones;
    }
  }

  /**
   * Asigna una hora automáticamente a un registro
   * @param {Object} registro - Registro
   * @param {string} horaIngreso - Hora de ingreso
   * @param {string} horaSalida - Hora de salida
   * @param {string} fecha - Fecha
   * @param {number} cantidadHoras - Cantidad de horas
   * @param {boolean} esHoraExtra - Si es hora extra
   * @param {Object} transaction - Transacción
   * @returns {Promise<Object|null>} Información de la asignación
   */
  async asignarHoraAutomaticamente(registro, horaIngreso, horaSalida, fecha, cantidadHoras, esHoraExtra = false, transaction = null) {
    if (cantidadHoras <= 0) return null;
    
    try {
      const tipoHora = await this.determinarTipoHoraCorrect(horaIngreso, horaSalida, fecha, esHoraExtra);
      
      if (tipoHora && tipoHora.id) {
        // Asignar usando el ID correcto del modelo
        await registro.addHora(tipoHora.id, {
          through: { cantidad: cantidadHoras },
          transaction
        });
        
        console.log(`✅ Asignado: ${tipoHora.tipo} - ${cantidadHoras} horas`);
        
        return {
          tipo: tipoHora.tipo,
          denominacion: tipoHora.denominacion,
          cantidad: cantidadHoras,
          id: tipoHora.id
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error en asignarHoraAutomaticamente:', error);
      return null;
    }
  }

  /**
   * Determina el tipo de hora correcto basado en condiciones
   * @param {string} horaIngreso - Hora de ingreso
   * @param {string} horaSalida - Hora de salida
   * @param {string} fecha - Fecha
   * @param {boolean} esHoraExtra - Si es hora extra
   * @returns {Promise<Object|null>} Tipo de hora encontrado
   */
  async determinarTipoHoraCorrect(horaIngreso, horaSalida, fecha, esHoraExtra = false) {
    const esFestivo = this.esFechaFestiva(fecha);
    const salidaMin = this.convertirHoraAMinutos(horaSalida);
    
    // Determinar si es nocturno (después de las 18:00)
    const esNocturno = salidaMin >= 1080; // 18:00 = 1080 minutos
    
    let tipoHoraBuscado = null;
    
    if (esHoraExtra) {
      // Para horas extra
      if (esFestivo && esNocturno) {
        tipoHoraBuscado = 'H.E.F.N.'; // Hora Extra Festiva Nocturna
      } else if (esFestivo && !esNocturno) {
        tipoHoraBuscado = 'H.E.F.D.'; // Hora Extra Festiva Diurna
      } else if (!esFestivo && esNocturno) {
        tipoHoraBuscado = 'H.E.N.'; // Hora Extra Nocturna
      } else {
        tipoHoraBuscado = 'H.E.D.'; // Hora Extra Diurna
      }
    } else {
      // Para recargos de horario regular
      if (esFestivo && esNocturno) {
        tipoHoraBuscado = 'R.F.NOC.'; // Recargo Festivo Nocturno
      } else if (esFestivo && !esNocturno) {
        tipoHoraBuscado = 'R.F.'; // Recargo Festivo
      } else if (!esFestivo && esNocturno) {
        tipoHoraBuscado = 'R.NOC.'; // Recargo Nocturno
      } else {
        return null; // No hay recargo para horario diurno regular
      }
    }
    
    try {
      // Usar HoraLogic para obtener el tipo de hora correcto
      const tipoHora = await HoraLogic.obtenerHoraPorTipo(tipoHoraBuscado);
      return tipoHora;
    } catch (error) {
      console.warn(`No se encontró tipo de hora: ${tipoHoraBuscado}`);
      return null;
    }
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
   * Verifica si una fecha es festiva (días festivos colombianos)
   * @param {string} fecha - Fecha en formato YYYY-MM-DD
   * @returns {boolean} True si es festivo
   */
  esFechaFestiva(fecha) {
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth() + 1; // getMonth() retorna 0-11
    const dia = fechaObj.getDate();
    
    // Festivos fijos más comunes en Colombia
    const festivosFijos = [
      { mes: 1, dia: 1 },   // Año Nuevo
      { mes: 5, dia: 1 },   // Día del Trabajo
      { mes: 7, dia: 20 },  // Día de la Independencia
      { mes: 8, dia: 7 },   // Batalla de Boyacá
      { mes: 12, dia: 8 },  // Inmaculada Concepción
      { mes: 12, dia: 25 }  // Navidad
    ];
    
    return festivosFijos.some(festivo => festivo.mes === mes && festivo.dia === dia);
  }
}

module.exports = new AsignadorTiposHora();
