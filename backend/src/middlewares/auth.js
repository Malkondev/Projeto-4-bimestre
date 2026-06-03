const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { readDatabase, sanitizeUser } = require('../services/database');

function authRequired(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não informado.' });
  }

  try {
    const token = header.replace('Bearer ', '');
    const payload = jwt.verify(token, env.jwtSecret);
    const db = readDatabase();
    const user = db.users.find((item) => item.id === payload.sub);

    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado.' });
    }

    req.user = sanitizeUser(user);
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
}

function premiumRequired(req, res, next) {
  if (req.user?.plan !== 'premium') {
    return res.status(403).json({
      message: 'Funcionalidade disponível apenas para usuários Premium.'
    });
  }

  return next();
}

module.exports = {
  authRequired,
  premiumRequired
};
