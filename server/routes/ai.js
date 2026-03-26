const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `
You are an AI shopping assistant.

Respond ONLY in VALID JSON. Do not include backticks or explanations.

Format:
{
  "intent": "show_products | add_to_cart | normal_chat",
  "query": "product name or keyword",
  "price": number or null,
  "reply": "only for normal_chat"
}

Examples:

User: show products
{"intent":"show_products","query":"","price":null}

User: add iphone to cart
{"intent":"add_to_cart","query":"iphone","price":null}

User: hello
{"intent":"normal_chat","reply":"Hi! How can I help you?"}

User: ${message}
`,
              },
            ],
          },
        ],
      }
    );

    const text =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

  let parsed;

try {
  // 🔥 REMOVE ```json and ```
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  parsed = JSON.parse(cleaned);

} catch {
  parsed = {
    intent: "normal_chat",
    reply: text,
  };
}
    res.json(parsed);

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.json({ intent: "error" });
  }
});

module.exports = router;