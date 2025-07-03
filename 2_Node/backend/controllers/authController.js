const authLogic = require('../logic/authLogic');

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Intentando login con:', { email, password });
  try {
    const result = await authLogic.login(email, password);
    console.log('Login exitoso para:', email);
    res.json(result);
  } catch (error) {
    console.error('Error en login:', error);
    res.status(401).json({ error: error.message });
  }
};

module.exports = { login }; 