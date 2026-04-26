const express = require("express");

console.log("🔥 TEST VERSION RUNNING 🔥");

const app = express();

// JSON parse
app.use(express.json());

// Debug logs
app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});

// Root check
app.get("/", (req, res) => {
  res.send("Server working 🚀");
});

// ✅ TEST /render route
app.all("/render", (req, res) => {
  console.log("🔥 /render HIT 🔥");

  const { url } = req.body || {};

  if (!url) {
    return res.status(400).json({ error: "URL required" });
  }

  return res.json({
    success: true,
    message: "Route working",
    received: url,
  });
});

// fallback (important)
app.use((req, res) => {
  res.status(404).send("Route not found");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
