const express = require('express');
const { v4: uuid } = require('uuid');
const { readDatabase, writeDatabase } = require('../services/database');
const { authRequired } = require('../middlewares/auth');

const router = express.Router();
router.use(authRequired);

router.post('/', (req, res) => {
  const { name, category, color, occasion, season, imageUrl, notes } = req.body;

  if (!name || !category) {
    return res.status(400).json({ message: 'Nome e categoria são obrigatórios.' });
  }

  const db = readDatabase();
  const item = {
    id: uuid(),
    userId: req.user.id,
    name,
    category,
    color: color || null,
    occasion: occasion || null,
    season: season || null,
    imageUrl: imageUrl || null,
    notes: notes || null,
    createdAt: new Date().toISOString()
  };

  db.clothingItems.push(item);
  writeDatabase(db);
  return res.status(201).json(item);
});

router.get('/', (req, res) => {
  const db = readDatabase();
  const items = db.clothingItems.filter((item) => item.userId === req.user.id);
  return res.json(items);
});

router.get('/:id', (req, res) => {
  const db = readDatabase();
  const item = db.clothingItems.find((entry) => entry.id === req.params.id && entry.userId === req.user.id);

  if (!item) {
    return res.status(404).json({ message: 'Peça não encontrada.' });
  }

  return res.json(item);
});

router.put('/:id', (req, res) => {
  const db = readDatabase();
  const index = db.clothingItems.findIndex((entry) => entry.id === req.params.id && entry.userId === req.user.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Peça não encontrada.' });
  }

  db.clothingItems[index] = {
    ...db.clothingItems[index],
    ...req.body,
    id: db.clothingItems[index].id,
    userId: req.user.id,
    updatedAt: new Date().toISOString()
  };

  writeDatabase(db);
  return res.json(db.clothingItems[index]);
});

router.delete('/:id', (req, res) => {
  const db = readDatabase();
  const before = db.clothingItems.length;
  db.clothingItems = db.clothingItems.filter((entry) => !(entry.id === req.params.id && entry.userId === req.user.id));

  if (db.clothingItems.length === before) {
    return res.status(404).json({ message: 'Peça não encontrada.' });
  }

  writeDatabase(db);
  return res.status(204).send();
});

module.exports = router;
