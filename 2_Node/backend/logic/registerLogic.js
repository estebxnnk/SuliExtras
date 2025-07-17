const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Persona = require('../models/Persona');

class RegisterLogic {
  async registrarUsuario({ email, password, persona, rolId }) {
    if (!email || !password || !persona || !rolId) {
      throw new Error('Faltan datos requeridos');
    }
    const emailNormalizado = email.trim().toLowerCase();
    const existe = await User.findOne({ where: { email: emailNormalizado } });
    if (existe) throw new Error('El usuario ya existe');
    const hashedPassword = await bcrypt.hash(password, 10);
    const personaCreada = await Persona.create(persona);
    const user = await User.create({
      email: emailNormalizado,
      password: hashedPassword,
      personaId: personaCreada.id,
      rolId
    });
    return user;
  }
}

module.exports = new RegisterLogic(); 