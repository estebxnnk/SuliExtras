const { DataTypes } = require('sequelize');
const sequelize = require('../../configDb/db').sequelize;
// Importar modelo Hora
const Hora = require('../../models/Hora')
const User = require('../../models/User');

// Tabla principal
const Registro = sequelize.define('Registro', {
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  horaIngreso: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  horaSalida: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  ubicacion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  usuario: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Temporalmente opcional para permitir migración
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  numRegistro: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  cantidadHorasExtra: {
    type: DataTypes.FLOAT,
    allowNull: false,
    // Este campo representa las horas reales registradas
  },
  horas_extra_divididas: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
    comment: 'Máximo 2 horas extra por registro para reporte',
  },
  bono_salarial: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
    comment: 'Horas extra que exceden el máximo y se consideran bono salarial',
  },
  justificacionHoraExtra: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  estado: {
    type: DataTypes.STRING,
    defaultValue: 'pendiente',
    allowNull: false,
  },
});

// Tabla intermedia
const RegistroHora = sequelize.define('RegistroHora', {
  cantidad: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

// Asociaciones
Registro.belongsToMany(Hora, {
  through: RegistroHora,
  foreignKey: 'registroId',
});

Hora.belongsToMany(Registro, {
  through: RegistroHora,
  foreignKey: 'horaId',
});

// Relación con User
Registro.belongsTo(User, { foreignKey: 'usuarioId', as: 'user' });
User.hasMany(Registro, { foreignKey: 'usuarioId', as: 'registros' });

module.exports = Registro;
