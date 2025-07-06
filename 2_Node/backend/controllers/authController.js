const authLogic = require('../logic/authLogic');

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await authLogic.login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = { login }; 