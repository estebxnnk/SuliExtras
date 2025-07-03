const { DataTypes } = require('sequelize');
const { sequelize } = require('../configDb/db');
const Rol = require('./Roles');
const Persona = require('./Persona');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
});

// Relación 1 a 1: Un usuario tiene una persona
User.belongsTo(Persona, { foreignKey: 'personaId', as: 'persona' });
// Relación: Un usuario pertenece a un rol
User.belongsTo(Rol, { foreignKey: 'rolId', as: 'rol' });
Rol.hasMany(User, { foreignKey: 'rolId', as: 'usuarios' });

module.exports = User; 