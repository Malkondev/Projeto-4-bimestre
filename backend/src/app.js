const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const clothingRoutes = require("./routes/clothing.routes");
const outfitRoutes = require("./routes/outfit.routes");
const suggestionRoutes = require("./routes/suggestion.routes");
const wishlistRoutes = require("./routes/wishlist.routes");

const errorHandler = require("./middlewares/errorHandler");

const app = express();
console.log("authRoutes:", typeof authRoutes);
console.log("clothingRoutes:", typeof clothingRoutes);
console.log("outfitRoutes:", typeof outfitRoutes);
console.log("suggestionRoutes:", typeof suggestionRoutes);
console.log("wishlistRoutes:", typeof wishlistRoutes);
console.log("errorHandler:", typeof errorHandler);
app.use(cors());
app.use(express.json());

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