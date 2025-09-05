const { DataTypes } = require('sequelize');
const { sequelize } = require('../configDb/db');

const HorarioSede = sequelize.define('HorarioSede', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  sedeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'sedes',
      key: 'id'
    },
    comment: 'ID de la sede a la que pertenece este horario'
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Nombre del horario (ej: Horario Normal, Horario Nocturno, etc.)'
  },
  tipo: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'normal',
    validate: {
      isIn: [['normal', 'nocturno', 'especial', 'festivo']]
    },
    comment: 'Tipo de horario'
  },
  horaEntrada: {
    type: DataTypes.TIME,
    allowNull: false,
    comment: 'Hora de entrada para este horario'
  },
  horaSalida: {
    type: DataTypes.TIME,
    allowNull: false,
    comment: 'Hora de salida para este horario'
  },
  horasJornada: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: 'Horas de la jornada normal para este horario'
  },
  horasJornadaReal: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: 'Horas reales trabajadas (horasJornada - tiempo de almuerzo)'
  },
  tiempoAlmuerzo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 60,
    validate: {
      min: 0,
      max: 180
    },
    comment: 'Tiempo de almuerzo en minutos'
  },
  diasTrabajados: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    defaultValue: ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'],
    comment: 'Días de la semana que se trabaja (ej: ["LUNES", "MARTES", "MIÉRCOLES"])'
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Si el horario está activo'
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Descripción adicional del horario'
  }
}, {
  timestamps: true,
  tableName: 'horarios_sede',
  indexes: [
    {
      unique: true,
      fields: ['sedeId', 'tipo']
    }
  ]
});

module.exports = HorarioSede; 