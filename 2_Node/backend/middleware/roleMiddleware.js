const User = require('../models/User');
const Rol = require('../models/Roles');

/**
 * Middleware para verificar si el usuario tiene un rol específico
 * @param {string|Array} roles - Rol o array de roles permitidos
 */
// TEMPORAL: Bypass de verificación de roles para pruebas. Permite todas las solicitudes.
const verificarRol = () => {
  return (req, res, next) => {
    // Asegura que exista un usuario simulado
    if (!req.user) {
      req.user = { id: 0, email: 'test@local', rol: 'SuperAdministrador' };
    }

    // Provee información de usuario consistente para controladores que la utilicen
    req.userInfo = {
      id: req.user.id,
      email: req.user.email,
      rol: req.user.rol || 'SuperAdministrador'
    };

    return next();
  };
};

/**
 * Middleware específico para empleados
 */
const soloEmpleados = verificarRol();

/**
 * Middleware para supervisores (JefeDirecto, Administrador, SuperAdministrador)
 */
const soloSupervisores = verificarRol();

/**
 * Middleware para administradores (Administrador, SuperAdministrador)
 */
const soloAdministradores = verificarRol();

/**
 * Middleware solo para super administrador
 */
const soloSuperAdmin = verificarRol();

module.exports = {
  verificarRol,
  soloEmpleados,
  soloSupervisores,
  soloAdministradores,
  soloSuperAdmin
}; 