const express = require('express');
const authService = require('../services/auth.service');
const { authRequired } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', (req, res, next) => {
  try {
    const { name, email, password, plan } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios.' });
    }

    const result = authService.register({ name, email, password, plan });
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
});

router.post('/login', (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }

    const result = authService.login({ email, password });
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

router.get('/me', authRequired, (req, res) => {
  return res.json({ user: req.user });
});

module.exports = router;
