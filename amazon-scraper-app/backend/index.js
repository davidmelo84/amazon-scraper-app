import { serve } from "bun";
import express from "express";
import axios from "axios";
import { JSDOM } from "jsdom";

const app = express();
const PORT = 3000;

app.get("/api/scrape", async (req, res) => {
  const { keyword } = req.query;
  if (!keyword) {
    return res.status(400).json({ error: "Keyword is required." });
  }

  const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;

  try {
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    const items = [];
    const products = document.querySelectorAll(".s-main-slot .s-result-item");

    products.forEach((product) => {
      const title = product.querySelector("h2 a span")?.textContent || null;
      const rating = product.querySelector(".a-icon-alt")?.textContent || null;
      const reviews = product.querySelector(".s-link-style span")?.textContent || null;
      const image = product.querySelector("img.s-image")?.src || null;

      if (title && image) {
        items.push({ title, rating, reviews, image });
      }
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Amazon page." });
  }
});

serve({ fetch: app, port: PORT });