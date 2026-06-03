const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const env = require('../config/env');
const { readDatabase, writeDatabase, sanitizeUser } = require('./database');

function createToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, plan: user.plan },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

function register({ name, email, password, plan = 'free' }) {
  const db = readDatabase();
  const normalizedEmail = String(email).trim().toLowerCase();

  const alreadyExists = db.users.some((user) => user.email === normalizedEmail);
  if (alreadyExists) {
    const error = new Error('E-mail já cadastrado.');
    error.status = 409;
    throw error;
  }

  const user = {
    id: uuid(),
    name,
    email: normalizedEmail,
    passwordHash: bcrypt.hashSync(password, 10),
    plan: plan === 'premium' ? 'premium' : 'free',
    createdAt: new Date().toISOString()
  };

  db.users.push(user);
  writeDatabase(db);

  return {
    user: sanitizeUser(user),
    token: createToken(user)
  };
}

function login({ email, password }) {
  const db = readDatabase();
  const normalizedEmail = String(email).trim().toLowerCase();
  const user = db.users.find((item) => item.email === normalizedEmail);

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    const error = new Error('Credenciais inválidas.');
    error.status = 401;
    throw error;
  }

  return {
    user: sanitizeUser(user),
    token: createToken(user)
  };
}

module.exports = {
  register,
  login
};
