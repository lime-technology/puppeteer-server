const express = require("express");

console.log("🔥 FINAL FIX RUNNING 🔥");

const app = express();

app.use(express.json());

// Debug
app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});

// ✅ HANDLE ALL METHODS + FORCE RESPONSE
app.use("/render", (req, res) => {
  console.log("🔥 /render HIT 🔥");

  if (req.method === "HEAD") {
    return res.status(200).end();
  }

  const { url } = req.body || {};

  return res.json({
    success: true,
    method: req.method,
    received: url || null
  });
});

// Test route
app.get("/test", (req, res) => {
  res.send("TEST OK");
});

// Root
app.get("/", (req, res) => {
  res.send("Server working 🚀");
});

// Fallback
app.use((req, res) => {
  res.status(404).send("Not Found");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
