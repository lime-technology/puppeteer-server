const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server working 🚀");
});

// 🔥 MAIN API
app.post("/render", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL required" });
  }

  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    const screenshot = await page.screenshot({
      fullPage: true,
      encoding: "base64",
    });

    await browser.close();

    res.json({
      success: true,
      image: screenshot,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to render" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
