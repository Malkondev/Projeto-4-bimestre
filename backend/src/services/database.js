const fs = require('fs');
const path = require('path');
const env = require('../config/env');

const databasePath = path.resolve(process.cwd(), env.databaseFile);
const initialData = {
  users: [],
  clothingItems: [],
  outfits: [],
  wishlist: []
};

function ensureDatabaseFile() {
  const dir = path.dirname(databasePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(databasePath)) {
    fs.writeFileSync(databasePath, JSON.stringify(initialData, null, 2));
  }
}

function readDatabase() {
  ensureDatabaseFile();
  const file = fs.readFileSync(databasePath, 'utf-8');
  return JSON.parse(file);
}

function writeDatabase(data) {
  ensureDatabaseFile();
  fs.writeFileSync(databasePath, JSON.stringify(data, null, 2));
}

function sanitizeUser(user) {
  if (!user) return null;
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

module.exports = {
  readDatabase,
  writeDatabase,
  sanitizeUser
};
