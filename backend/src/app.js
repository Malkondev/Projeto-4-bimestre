const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const clothingRoutes = require('./routes/clothing.routes');
const outfitRoutes = require('./routes/outfit.routes');
const wishlistRoutes = require('./routes/wishlist.routes');
const suggestionRoutes = require('./routes/suggestion.routes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  return res.json({
    name: 'SmartCloset API',
    version: '1.0.0',
    docs: '/api/health',
    status: 'online'
  });
});

app.get('/api/health', (req, res) => {
  return res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/clothing-items', clothingRoutes);
app.use('/api/outfits', outfitRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/suggestions', suggestionRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
