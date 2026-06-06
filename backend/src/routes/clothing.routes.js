const express = require("express");
const pool = require("../config/db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [items] = await pool.query(
      "SELECT * FROM clothing_items ORDER BY created_at DESC"
    );

    res.json(items);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar peças",
      error: error.message,
    });
  }
});

router.patch("/:id/favorite", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "UPDATE clothing_items SET is_favorite = NOT is_favorite WHERE id = ?",
      [id]
    );

    const [items] = await pool.query(
      "SELECT * FROM clothing_items WHERE id = ?",
      [id]
    );

    res.json(items[0]);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao atualizar favorito",
      error: error.message,
    });
  }
});

router.patch("/:id/wishlist", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "UPDATE clothing_items SET is_wishlist = NOT is_wishlist WHERE id = ?",
      [id]
    );

    const [items] = await pool.query(
      "SELECT * FROM clothing_items WHERE id = ?",
      [id]
    );

    res.json(items[0]);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao atualizar lista de desejos",
      error: error.message,
    });
  }
});

module.exports = router;