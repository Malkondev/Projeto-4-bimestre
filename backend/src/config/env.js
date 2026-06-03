require('dotenv').config();

const env = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'smartcloset_dev_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  databaseFile: process.env.DATABASE_FILE || 'src/data/database.json'
};

module.exports = env;
