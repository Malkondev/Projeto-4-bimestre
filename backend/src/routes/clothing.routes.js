const express = require("express");
const pool = require("../config/db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const userId = req.query.user_id || 1;

    const [items] = await pool.query(
      "SELECT * FROM clothing_items WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    res.json(items);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar peças",
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      user_id = 1,
      name,
      category,
      image_url,
      is_favorite = false,
      is_wishlist = false,
    } = req.body;

    if (!name || !category || !image_url) {
      return res.status(400).json({
        message: "Nome, tipo e imagem são obrigatórios.",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO clothing_items
       (user_id, name, category, image_url, is_favorite, is_wishlist)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, name, category, image_url, Boolean(is_favorite), Boolean(is_wishlist)]
    );

    const [items] = await pool.query(
      "SELECT * FROM clothing_items WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(items[0]);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao cadastrar peça",
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

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [items] = await pool.query(
      "SELECT * FROM clothing_items WHERE id = ?",
      [id]
    );

    if (items.length === 0) {
      return res.status(404).json({
        message: "Peça não encontrada.",
      });
    }

    await pool.query("DELETE FROM clothing_items WHERE id = ?", [id]);

    res.json({
      message: "Peça removida com sucesso.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao remover peça",
      error: error.message,
    });
  }
});

module.exports = router;