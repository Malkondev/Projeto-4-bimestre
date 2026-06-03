const express = require('express');
const { v4: uuid } = require('uuid');
const { readDatabase, writeDatabase } = require('../services/database');
const { authRequired } = require('../middlewares/auth');

const router = express.Router();
router.use(authRequired);

router.post('/', (req, res) => {
  const { name, category, color, price, store, imageUrl, notes } = req.body;

  if (!name || !category) {
    return res.status(400).json({ message: 'Nome e categoria são obrigatórios.' });
  }

  const db = readDatabase();
  const wishlistItem = {
    id: uuid(),
    userId: req.user.id,
    name,
    category,
    color: color || null,
    price: price || null,
    store: store || null,
    imageUrl: imageUrl || null,
    notes: notes || null,
    purchased: false,
    createdAt: new Date().toISOString()
  };

  db.wishlist.push(wishlistItem);
  writeDatabase(db);
  return res.status(201).json(wishlistItem);
});

router.get('/', (req, res) => {
  const db = readDatabase();
  const items = db.wishlist.filter((item) => item.userId === req.user.id);
  return res.json(items);
});

router.put('/:id/purchased', (req, res) => {
  const db = readDatabase();
  const item = db.wishlist.find((entry) => entry.id === req.params.id && entry.userId === req.user.id);

  if (!item) {
    return res.status(404).json({ message: 'Item da wishlist não encontrado.' });
  }

  item.purchased = !item.purchased;
  item.updatedAt = new Date().toISOString();
  writeDatabase(db);
  return res.json(item);
});

router.delete('/:id', (req, res) => {
  const db = readDatabase();
  const before = db.wishlist.length;
  db.wishlist = db.wishlist.filter((entry) => !(entry.id === req.params.id && entry.userId === req.user.id));

  if (db.wishlist.length === before) {
    return res.status(404).json({ message: 'Item da wishlist não encontrado.' });
  }

  writeDatabase(db);
  return res.status(204).send();
});

module.exports = router;
