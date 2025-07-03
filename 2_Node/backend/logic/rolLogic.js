const Rol = require('../models/Roles');

class RolLogic {
  async crearRol({ nombre, estado = true }) {
    if (!nombre) throw new Error('El nombre del rol es requerido');
    const existe = await Rol.findOne({ where: { nombre } });
    if (existe) throw new Error('El rol ya existe');
    return await Rol.create({ nombre, estado });
  }

  async listarRoles() {
    return await Rol.findAll();
  }
}

module.exports = new RolLogic(); 