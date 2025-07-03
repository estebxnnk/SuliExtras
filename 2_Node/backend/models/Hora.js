const { DataTypes } = require('sequelize');
const sequelize = require('../configDb/db').sequelize;

const Hora = sequelize.define('Hora', {
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    },
    comment: 'Tipo técnico, ej: HED, HEN, HEDF, etc.'
  },
  denominacion: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    },
    comment: 'Nombre amigable, ej: Hora extra diurna'
  },
  valor: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0
    },
    comment: 'Porcentaje de recargo, ej: 1.25 = 125%'
  }
});

module.exports = Hora;
