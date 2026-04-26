const express = require("express");
const puppeteer = require("puppeteer");

console.log("🔥 FINAL VERSION RUNNING 🔥");

const app = express();

app.use(express.json());

// Debug log
app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});

// Root route
app.get("/", (req, res) => {
  res.send("Server working 🚀");
});

// Render API
app.use("/render", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL required" });
  }

  let browser;

  try {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 20000,
    });

    const html = await page.content();

    res.json({
      success: true,
      html,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  } finally {
    if (browser) await browser.close();
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
