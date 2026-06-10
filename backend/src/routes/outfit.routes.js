const express = require("express");
const OpenAI = require("openai");
const pool = require("../config/db");

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.get("/", async (req, res) => {
  try {
    const [outfits] = await pool.query(
      "SELECT * FROM outfits ORDER BY created_at DESC"
    );

    res.json(outfits);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar montagens",
      error: error.message,
    });
  }
});

router.get("/public", async (req, res) => {
  try {
    const [outfits] = await pool.query(
      "SELECT * FROM outfits WHERE is_public = TRUE ORDER BY created_at DESC"
    );

    res.json(outfits);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar montagens públicas",
      error: error.message,
    });
  }
});

router.post("/generate", async (req, res) => {
  try {
    const { clothing_item_ids = [], look_name = "Look SmartCloset" } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(400).json({
        message: "OPENAI_API_KEY não configurada no arquivo .env.",
      });
    }

    if (!Array.isArray(clothing_item_ids) || clothing_item_ids.length < 2) {
      return res.status(400).json({
        message: "Selecione pelo menos duas peças para gerar o look.",
      });
    }

    const [items] = await pool.query(
      `SELECT id, name, category, image_url
       FROM clothing_items
       WHERE id IN (?)`,
      [clothing_item_ids]
    );

    if (items.length < 2) {
      return res.status(400).json({
        message: "Peças não encontradas.",
      });
    }

    const clothesDescription = items
      .map((item) => `- ${item.name}, categoria ${item.category}`)
      .join("\n");

    const prompt = `
Crie uma imagem de moda mostrando um look completo montado com estas peças:

${clothesDescription}

A imagem deve parecer uma montagem de catálogo de moda, em fundo claro, elegante, organizada, com as roupas combinando entre si. Não coloque textos na imagem. Não mostre marcas. Não mostre rosto de pessoa famosa.
`;

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
    });

    const imageBase64 = result.data?.[0]?.b64_json;

    if (!imageBase64) {
      return res.status(500).json({
        message: "A IA não retornou imagem.",
      });
    }

    res.json({
      image: `data:image/png;base64,${imageBase64}`,
      prompt,
      items,
      look_name,
    });
  } catch (error) {
    console.error("Erro ao gerar montagem com IA:", error);

    res.status(500).json({
      message: "Erro ao gerar montagem com IA.",
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      user_id = 1,
      name,
      description = "",
      generated_image_url,
      clothing_item_ids = [],
      is_public = true,
    } = req.body;

    if (!name || !generated_image_url) {
      return res.status(400).json({
        message: "Nome e imagem da montagem são obrigatórios.",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO outfits
       (user_id, name, description, generated_image_url, is_public)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, name, description, generated_image_url, Boolean(is_public)]
    );

    const outfitId = result.insertId;

    if (Array.isArray(clothing_item_ids) && clothing_item_ids.length > 0) {
      for (const clothingItemId of clothing_item_ids) {
        await pool.query(
          `INSERT INTO outfit_items
           (outfit_id, clothing_item_id)
           VALUES (?, ?)`,
          [outfitId, clothingItemId]
        );
      }
    }

    const [outfits] = await pool.query(
      "SELECT * FROM outfits WHERE id = ?",
      [outfitId]
    );

    res.status(201).json(outfits[0]);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao salvar montagem",
      error: error.message,
    });
  }
});

module.exports = router;