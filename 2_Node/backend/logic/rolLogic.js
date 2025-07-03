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

  // Eliminar un rol por ID
  async eliminarRol(id) {
    const rol = await Rol.findByPk(id);
    if (!rol) throw new Error('Rol no encontrado');
    await rol.destroy();
    return { mensaje: 'Rol eliminado correctamente' };
  }
}

module.exports = new RolLogic(); 