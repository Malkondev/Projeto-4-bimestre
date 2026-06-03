const express = require('express');
const { v4: uuid } = require('uuid');
const { readDatabase, writeDatabase } = require('../services/database');
const { authRequired } = require('../middlewares/auth');

const router = express.Router();
router.use(authRequired);

router.post('/', (req, res) => {
  const { name, clothingItemIds, description, favorite = false } = req.body;

  if (!name || !Array.isArray(clothingItemIds) || clothingItemIds.length === 0) {
    return res.status(400).json({ message: 'Nome e lista de peças são obrigatórios.' });
  }

  const db = readDatabase();
  const userItemIds = db.clothingItems
    .filter((item) => item.userId === req.user.id)
    .map((item) => item.id);

  const invalidItem = clothingItemIds.find((id) => !userItemIds.includes(id));
  if (invalidItem) {
    return res.status(400).json({ message: 'O look possui peça inexistente ou de outro usuário.' });
  }

  const outfit = {
    id: uuid(),
    userId: req.user.id,
    name,
    clothingItemIds,
    description: description || null,
    favorite: Boolean(favorite),
    createdAt: new Date().toISOString()
  };

  db.outfits.push(outfit);
  writeDatabase(db);
  return res.status(201).json(outfit);
});

router.get('/', (req, res) => {
  const db = readDatabase();
  const outfits = db.outfits.filter((item) => item.userId === req.user.id);
  return res.json(outfits);
});

router.get('/favorites', (req, res) => {
  const db = readDatabase();
  const outfits = db.outfits.filter((item) => item.userId === req.user.id && item.favorite);
  return res.json(outfits);
});

router.put('/:id/favorite', (req, res) => {
  const db = readDatabase();
  const outfit = db.outfits.find((item) => item.id === req.params.id && item.userId === req.user.id);

  if (!outfit) {
    return res.status(404).json({ message: 'Look não encontrado.' });
  }

  outfit.favorite = !outfit.favorite;
  outfit.updatedAt = new Date().toISOString();
  writeDatabase(db);
  return res.json(outfit);
});

router.delete('/:id', (req, res) => {
  const db = readDatabase();
  const before = db.outfits.length;
  db.outfits = db.outfits.filter((entry) => !(entry.id === req.params.id && entry.userId === req.user.id));

  if (db.outfits.length === before) {
    return res.status(404).json({ message: 'Look não encontrado.' });
  }

  writeDatabase(db);
  return res.status(204).send();
});

module.exports = router;
