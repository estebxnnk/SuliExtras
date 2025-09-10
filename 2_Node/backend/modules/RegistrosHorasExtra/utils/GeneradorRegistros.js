const Registro = require('../RegistroModel');
const User = require('../../../models/User');
const Hora = require('../../../models/Hora');

/**
 * Generador Singleton para registros
 * Maneja la creación y obtención de registros del método crearRegistrosBulk
 */
class GeneradorRegistros {
  constructor() {
    if (GeneradorRegistros.instance) {
      return GeneradorRegistros.instance;
    }
    GeneradorRegistros.instance = this;
  }

  /**
   * Crea un registro individual en la base de datos
   * @param {Object} datosRegistro - Datos del registro
   * @param {Object} user - Usuario que crea el registro
   * @param {number} cantidadHorasExtra - Cantidad de horas extra
   * @param {number} horasExtraDivididas - Horas extra divididas
   * @param {number} bonoSalarial - Bono salarial
   * @param {Object} transaction - Transacción de base de datos
   * @returns {Promise<Object>} Registro creado
   */
  async crearRegistro(datosRegistro, user, cantidadHorasExtra, horasExtraDivididas, bonoSalarial, transaction) {
    const numRegistro = datosRegistro.numRegistro || this.generarNumeroRegistro();

    return await Registro.create({
      ...datosRegistro,
      usuarioId: user.id,
      usuario: user.email,
      numRegistro,
      cantidadHorasExtra: Number(cantidadHorasExtra),
      horas_extra_divididas: horasExtraDivididas,
      bono_salarial: bonoSalarial,
      estado: datosRegistro.estado || 'pendiente'
    }, { transaction });
  }

  /**
   * Obtiene registros completos con todas las relaciones
   * @param {Array} registrosCreados - Array de registros creados
   * @returns {Promise<Array>} Registros con información completa
   */
  async obtenerRegistrosCompletos(registrosCreados) {
    return await Promise.all(
      registrosCreados.map(registro => 
        Registro.findByPk(registro.id, {
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'email']
            },
            {
              model: Hora,
              through: {
                attributes: ['cantidad']
              }
            }
          ]
        })
      )
    );
  }

  /**
   * Genera un número de registro único
   * @returns {string} Número de registro único
   */
  generarNumeroRegistro() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `REG-${timestamp}-${random}`;
  }

  /**
   * Configura las opciones por defecto del método
   * @param {Object} opciones - Opciones proporcionadas
   * @returns {Object} Configuración completa
   */
  configurarOpciones(opciones) {
    return {
      calcularHorasExtraAutomaticamente: opciones.calcularHorasExtraAutomaticamente !== false,
      asociarTiposHoraAutomaticamente: opciones.asociarTiposHoraAutomaticamente !== false,
      validarHorarios: opciones.validarHorarios !== false,
      incluirRecargos: opciones.incluirRecargos !== false
    };
  }

  /**
   * Genera la respuesta final del método crearRegistrosBulk
   * @param {Array} registrosCompletos - Registros con información completa
   * @param {Object} configuracion - Configuración utilizada
   * @param {Object} sedeUsuario - Sede del usuario
   * @returns {Object} Respuesta final
   */
  generarRespuestaFinal(registrosCompletos, configuracion, sedeUsuario) {
    return {
      registrosCreados: registrosCompletos,
      totalCreados: registrosCompletos.length,
      configuracion: {
        ...configuracion,
        sedeEncontrada: !!sedeUsuario,
        metodosAsignacion: 'HoraLogic.obtenerHoraPorTipo'
      }
    };
  }
}

module.exports = new GeneradorRegistros();
