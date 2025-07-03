const { DataTypes } = require('sequelize');
const { sequelize } = require('../configDb/db');
const Persona = require('./Persona');

const JefeDirecto = sequelize.define('JefeDirecto', {
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
});

JefeDirecto.belongsTo(Persona, { foreignKey: 'personaId', as: 'persona' });

module.exports = JefeDirecto; 