const { DataTypes } = require('sequelize');
const sequelize = require('../configDb/db').sequelize;

const Registro = sequelize.define('Registro', {
  fecha: { type: DataTypes.DATEONLY, allowNull: false },
  horaIngreso: { type: DataTypes.TIME, allowNull: false },
  horaSalida: { type: DataTypes.TIME, allowNull: false },
  ubicacion: { type: DataTypes.STRING, allowNull: false },
  usuario: { type: DataTypes.STRING, allowNull: false },
  numRegistro: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  cantidadHorasExtra: { type: DataTypes.INTEGER },
  justificacionHoraExtra: { type: DataTypes.STRING },
  estado: { type: DataTypes.STRING, allowNull: false }
});

module.exports = Registro; 