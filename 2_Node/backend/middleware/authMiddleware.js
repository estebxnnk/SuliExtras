// TEMPORAL: Bypass de autenticación para pruebas. Elimina verificación de JWT y permite todas las solicitudes.
function authBypass(req, res, next) {
  // Simula un usuario autenticado con rol alto para evitar bloqueos por roles durante pruebas
  req.user = req.user || { id: 0, email: 'test@local', rol: 'SuperAdministrador' };
  return next();
}

module.exports = authBypass;