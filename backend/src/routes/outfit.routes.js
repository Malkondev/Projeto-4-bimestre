const express = require("express");
const { GoogleGenAI } = require("@google/genai");
const pool = require("../config/db");

const router = express.Router();

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

function createSuggestionPrompt(items, lookName) {
  const clothesDescription = items
    .map((item) => `- ${item.name}, categoria: ${item.category}`)
    .join("\n");

  return `
Você é uma consultora de moda do aplicativo SmartCloset.

Analise o look chamado "${lookName}" com estas peças:

${clothesDescription}

Responda em português do Brasil, de forma clara, natural e útil.

Use exatamente esta estrutura:

Look:
${lookName}

Descrição do look:
[descreva o visual considerando as peças escolhidas]

Onde usar:
[diga ocasiões adequadas]

O que combina bem:
[diga por que as peças combinam ou o que pode funcionar]

O que poderia melhorar:
[diga o que falta ou o que poderia ser trocado]

Sugestão de acessórios:
[dê acessórios específicos para esse look]

Nota final:
[dê uma nota de 0 a 10 e explique rapidamente]

Não invente marcas.
Não diga que é uma simulação.
Não use texto muito longo.
`;
}

function createFallbackSuggestion(items, lookName) {
  const names = items.map((item) => item.name).join(", ");
  const categories = items.map((item) => item.category);

  const hasBlusa = categories.some((category) =>
    String(category).toLowerCase().includes("blusa")
  );

  const hasCalca = categories.some(
    (category) =>
      String(category).toLowerCase().includes("calça") ||
      String(category).toLowerCase().includes("calca")
  );

  const hasSapato = categories.some((category) =>
    String(category).toLowerCase().includes("sapato")
  );

  const hasVestido = categories.some((category) =>
    String(category).toLowerCase().includes("vestido")
  );

  const hasAcessorio = categories.some((category) =>
    String(category).toLowerCase().includes("acess")
  );

  let description = `Esse look chamado "${lookName}" foi montado com: ${names}. `;

  if (hasVestido) {
    description +=
      "A presença de vestido deixa o visual mais marcante e pode funcionar bem em ocasiões casuais arrumadas ou eventos simples.";
  } else if (hasBlusa && hasCalca) {
    description +=
      "A combinação de blusa com calça cria uma base equilibrada, prática e fácil de usar no dia a dia.";
  } else if (hasBlusa && hasSapato) {
    description +=
      "A blusa combinada com o sapato cria um visual simples, mas que pode ficar mais interessante com uma peça inferior neutra.";
  } else {
    description +=
      "As peças formam uma combinação básica, que pode ser melhorada com equilíbrio de cores e acessórios.";
  }

  let whereToUse = "Pode ser usado em passeios, escola, faculdade ou encontros casuais.";

  if (hasSapato && hasAcessorio) {
    whereToUse =
      "Pode ser usado em ocasiões casuais mais arrumadas, como sair com amigos, almoço, passeio no shopping ou encontro informal.";
  }

  if (hasVestido) {
    whereToUse =
      "Pode ser usado em passeios, eventos durante o dia, encontros casuais ou ocasiões em que você queira um visual mais arrumado.";
  }

  let improvement =
    "Para melhorar, tente adicionar uma peça que destaque o look, como uma bolsa, jaqueta, cinto ou acessório que combine com as cores.";

  if (!hasSapato) {
    improvement =
      "O look ficaria mais completo escolhendo um sapato adequado, como tênis casual, sandália ou sapato neutro.";
  }

  if (!hasAcessorio) {
    improvement +=
      " Também seria interessante adicionar acessórios discretos para dar mais personalidade ao visual.";
  }

  const score =
    hasBlusa && hasCalca && hasSapato ? "9/10" : hasVestido ? "8.5/10" : "8/10";

  return `
Look:
${lookName}

Descrição do look:
${description}

Onde usar:
${whereToUse}

O que combina bem:
As peças escolhidas podem funcionar bem juntas se as cores estiverem equilibradas. O visual fica melhor quando existe uma peça principal e as outras ajudam a complementar.

O que poderia melhorar:
${improvement}

Sugestão de acessórios:
Use bolsa neutra, relógio, pulseira, colar discreto ou uma terceira peça, como jaqueta ou camisa aberta, dependendo da ocasião.

Nota final:
${score}
`;
}

async function generateSuggestionWithGemini(prompt) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY não configurada no .env");
  }

  const modelsToTry = [
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash-lite",
    "gemini-2.0-flash",
    "gemini-2.5-flash",
  ];

  let lastError = null;

  for (const model of modelsToTry) {
    try {
      console.log(`Tentando modelo Gemini: ${model}`);

      const response = await gemini.models.generateContent({
        model,
        contents: prompt,
      });

      const text = response.text;

      if (!text || text.trim().length < 20) {
        throw new Error(`Modelo ${model} retornou resposta vazia.`);
      }

      console.log(`Gemini respondeu com sucesso usando: ${model}`);
      return text.trim();
    } catch (error) {
      lastError = error;
      console.log(`Modelo ${model} falhou:`, error.message);
    }
  }

  throw lastError || new Error("Todos os modelos Gemini falharam.");
}

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

    const outfitsWithItems = [];

    for (const outfit of outfits) {
      const [items] = await pool.query(
        `SELECT clothing_items.*
         FROM outfit_items
         INNER JOIN clothing_items
         ON outfit_items.clothing_item_id = clothing_items.id
         WHERE outfit_items.outfit_id = ?`,
        [outfit.id]
      );

      outfitsWithItems.push({
        ...outfit,
        clothing_items: items,
      });
    }

    res.json(outfitsWithItems);
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

    if (!Array.isArray(clothing_item_ids) || clothing_item_ids.length < 2) {
      return res.status(400).json({
        message: "Selecione pelo menos duas peças para gerar a sugestão.",
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

    const prompt = createSuggestionPrompt(items, look_name);

    let suggestion;
    let provider = "gemini";

    try {
      console.log("Tentando gerar sugestão com Gemini...");
      suggestion = await generateSuggestionWithGemini(prompt);
      console.log("Gemini respondeu com sucesso.");
    } catch (geminiError) {
      console.log("Gemini falhou. Usando sugestão local:", geminiError.message);
      suggestion = createFallbackSuggestion(items, look_name);
      provider = "fallback-local";
    }

    return res.json({
      suggestion,
      prompt,
      items,
      look_name,
      provider,
    });
  } catch (error) {
    console.error("Erro ao gerar sugestão com IA:", error);

    res.status(500).json({
      message: "Erro ao gerar sugestão com IA.",
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
      generated_image_url = null,
      ai_suggestion = "",
      clothing_item_ids = [],
      is_public = true,
    } = req.body;

    if (!name || !ai_suggestion) {
      return res.status(400).json({
        message: "Nome e sugestão da IA são obrigatórios.",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO outfits
       (user_id, name, description, generated_image_url, ai_suggestion, is_public)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        name,
        description,
        generated_image_url,
        ai_suggestion,
        Boolean(is_public),
      ]
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

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [outfits] = await pool.query(
      "SELECT * FROM outfits WHERE id = ?",
      [id]
    );

    if (outfits.length === 0) {
      return res.status(404).json({
        message: "Montagem não encontrada.",
      });
    }

    await pool.query("DELETE FROM outfits WHERE id = ?", [id]);

    res.json({
      message: "Montagem removida com sucesso.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao remover montagem",
      error: error.message,
    });
  }
});
module.exports = router;