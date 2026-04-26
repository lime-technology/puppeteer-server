const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

// ===== Middleware =====
app.use(express.json());

// ===== Debug log (IMPORTANT) =====
app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});

// ===== Root route (check server working) =====
app.get("/", (req, res) => {
  res.send("Server working 🚀");
});

// ===== Render route (main API) =====
app.use("/render", async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL required" });
  }

  let browser;

  try {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: "new",
    });

    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    const html = await page.content();

    return res.json({
      success: true,
      html,
    });

  } catch (err) {
    console.error("ERROR:", err.message);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  } finally {
    if (browser) await browser.close();
  }
});

// ===== PORT FIX (VERY IMPORTANT) =====
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Puppeteer server running on port ${PORT}`);
});
