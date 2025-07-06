const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Persona = require('../models/Persona');
const Rol = require('../models/Roles');
require('dotenv').config();

class AuthLogic {
  async login(email, password) {
    const user = await User.findOne({
      where: { email },
      include: [
        { model: Persona, as: 'persona' },
        { model: Rol, as: 'rol' }
      ]
    });
    if (!user) throw new Error('Usuario o contraseña incorrectos');
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error('Usuario o contraseña incorrectos');
    const payload = {
      id: user.id,
      email: user.email,
      rol: user.rol ? user.rol.nombre : null,
      persona: {
        id: user.personaId,
        nombres: user.persona ? user.persona.nombres : null,
        apellidos: user.persona ? user.persona.apellidos : null,
      }
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
    return { token, rol: payload.rol, usuario: payload };
  }
}

module.exports = new AuthLogic(); 