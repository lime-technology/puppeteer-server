const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
app.use(express.json());

app.post("/render", async (req, res) => {
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

app.listen(4000, () => {
  console.log("Puppeteer server running on port 4000");
});
