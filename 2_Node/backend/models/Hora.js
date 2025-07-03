const { DataTypes } = require('sequelize');
const sequelize = require('../configDb/db').sequelize;

const Hora = sequelize.define('Hora', {
  tipo: { type: DataTypes.STRING, allowNull: false },
  valor: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = Hora; 