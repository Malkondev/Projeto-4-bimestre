const express = require('express');
const { readDatabase } = require('../services/database');
const { authRequired, premiumRequired } = require('../middlewares/auth');

const router = express.Router();
router.use(authRequired);
router.use(premiumRequired);

router.post('/', (req, res) => {
  const { occasion = 'casual', weather = 'ameno' } = req.body;
  const db = readDatabase();
  const items = db.clothingItems.filter((item) => item.userId === req.user.id);

  if (items.length < 2) {
    return res.status(400).json({
      message: 'Cadastre pelo menos duas peças para receber uma sugestão.'
    });
  }

  const preferred = items.filter((item) => {
    const matchOccasion = !item.occasion || String(item.occasion).toLowerCase().includes(String(occasion).toLowerCase());
    const matchWeather = !item.season || String(weather).toLowerCase().includes(String(item.season).toLowerCase());
    return matchOccasion || matchWeather;
  });

  const selectedItems = (preferred.length >= 2 ? preferred : items).slice(0, 4);

  return res.json({
    title: `Sugestão para ${occasion}`,
    weather,
    items: selectedItems,
    explanation: 'Sugestão simulada para a versão inicial. Futuramente pode ser integrada com IA e API de clima.'
  });
});

module.exports = router;
