const { sequelize } = require('../configDb/db');
const Rol = require('../models/Roles');

const ROLES_PREDETERMINADOS = [
  { nombre: 'Administrador', estado: true },
  { nombre: 'SubAdministrador', estado: true },
  { nombre: 'JefeDirecto', estado: true },
  { nombre: 'Empleado', estado: true }
];

async function crearRolesPredeterminados() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    for (const rol of ROLES_PREDETERMINADOS) {
      const existe = await Rol.findOne({ where: { nombre: rol.nombre } });
      if (!existe) {
        await Rol.create(rol);
        console.log(`Rol creado: ${rol.nombre}`);
      } else {
        console.log(`Rol ya existe: ${rol.nombre}`);
      }
    }
    process.exit(0);
  } catch (error) {
    console.error('Error al crear roles predeterminados:', error);
    process.exit(1);
  }
}

crearRolesPredeterminados(); 