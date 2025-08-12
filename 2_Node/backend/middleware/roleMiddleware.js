const User = require('../models/User');
const Rol = require('../models/Roles');

/**
 * Middleware para verificar si el usuario tiene un rol específico
 * @param {string|Array} roles - Rol o array de roles permitidos
 */
const verificarRol = (roles) => {
  return async (req, res, next) => {
    try {
      // Verificar que el usuario esté autenticado
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
      }

      // Obtener el usuario con su rol
      const usuario = await User.findByPk(req.user.id, {
        include: [{ model: Rol, as: 'rol' }]
      });

      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Convertir roles a array si es string
      const rolesPermitidos = Array.isArray(roles) ? roles : [roles];

      // Verificar si el usuario tiene uno de los roles permitidos
      if (!rolesPermitidos.includes(usuario.rol.nombre)) {
        return res.status(403).json({ 
          error: `Acceso denegado. Se requiere uno de estos roles: ${rolesPermitidos.join(', ')}` 
        });
      }

      // Agregar información del usuario a la request
      req.userInfo = {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol.nombre
      };

      next();
    } catch (error) {
      console.error('Error en verificación de rol:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
};

/**
 * Middleware específico para empleados
 */
const soloEmpleados = verificarRol('Empleado');

/**
 * Middleware para supervisores (JefeDirecto, Administrador, SuperAdministrador)
 */
const soloSupervisores = verificarRol(['JefeDirecto', 'Administrador', 'SuperAdministrador']);

/**
 * Middleware para administradores (Administrador, SuperAdministrador)
 */
const soloAdministradores = verificarRol(['Administrador', 'SuperAdministrador']);

/**
 * Middleware solo para super administrador
 */
const soloSuperAdmin = verificarRol('SuperAdministrador');

module.exports = {
  verificarRol,
  soloEmpleados,
  soloSupervisores,
  soloAdministradores,
  soloSuperAdmin
}; 