const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const clothingRoutes = require("./routes/clothing.routes");
const outfitRoutes = require("./routes/outfit.routes");
const suggestionRoutes = require("./routes/suggestion.routes");
const wishlistRoutes = require("./routes/wishlist.routes");

const errorHandler = require("./middlewares/errorHandler");

const app = express();
app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "SmartCloset API funcionando",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/clothing", clothingRoutes);
app.use("/api/outfits", outfitRoutes);
app.use("/api/suggestions", suggestionRoutes);
app.use("/api/wishlist", wishlistRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Rota não encontrada.",
  });
});

app.use(errorHandler);

module.exports = app;