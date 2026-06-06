require("dotenv").config();

const pool = require("./src/config/db");

async function testConnection() {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS resultado");
    console.log("Banco conectado com sucesso:", rows);
    process.exit(0);
  } catch (error) {
    console.error("Erro ao conectar no banco:", error.message);
    process.exit(1);
  }
}

testConnection();