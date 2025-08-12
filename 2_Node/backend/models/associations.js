const User = require('./User');
const Persona = require('./Persona');
const Rol = require('./Roles');
const Sede = require('./Sede');
const HorarioSede = require('./HorarioSede');
const HorasTrabajadas = require('./HorasTrabajadas');

// Relaciones existentes
User.belongsTo(Persona, { foreignKey: 'personaId', as: 'persona' });
User.belongsTo(Rol, { foreignKey: 'rolId', as: 'rol' });
Rol.hasMany(User, { foreignKey: 'rolId', as: 'usuarios' });

// Relaciones con Sede
User.belongsTo(Sede, { foreignKey: 'sedeId', as: 'sede' });
Sede.hasMany(User, { foreignKey: 'sedeId', as: 'usuarios' });

// Relaciones con HorarioSede
Sede.hasMany(HorarioSede, { foreignKey: 'sedeId', as: 'horarios' });
HorarioSede.belongsTo(Sede, { foreignKey: 'sedeId', as: 'sede' });

// Relaciones con HorasTrabajadas
User.hasMany(HorasTrabajadas, { foreignKey: 'usuarioId', as: 'horasTrabajadas' });
HorasTrabajadas.belongsTo(User, { foreignKey: 'usuarioId', as: 'usuario' });

module.exports = {
  User,
  Persona,
  Rol,
  Sede,
  HorarioSede,
  HorasTrabajadas
}; 