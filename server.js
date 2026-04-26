const express = require("express");

console.log("🔥 FIXED VERSION RUNNING 🔥");

const app = express();

// JSON parser
app.use(express.json());

// Debug
app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});

// ✅ FIRST DEFINE /render (IMPORTANT)
app.all("/render", (req, res) => {
  console.log("🔥 /render HIT 🔥");

  const { url } = req.body || {};

  if (!url) {
    return res.status(400).json({ error: "URL required" });
  }

  return res.json({
    success: true,
    message: "Render working",
    received: url,
  });
});

// Root AFTER
app.get("/", (req, res) => {
  res.send("Server working 🚀");
});

// fallback LAST
app.use((req, res) => {
  res.status(404).send("Not Found");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
