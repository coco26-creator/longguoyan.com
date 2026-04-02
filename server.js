require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();

const allowedOrigins = ['https://coco26-creator.github.io', 'http://localhost:3000', 'http://127.0.0.1:5500', 'http://localhost:5500'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) { callback(null, true); } else { callback(new Error('Not allowed by CORS')); }
  }
}));
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const systemPrompt = `You are a knowledgeable and polite customer service representative for LongGuoYan, a premium Chinese Distillery brand. You must never mention that you are an AI or a language model. Speak entirely as a human employee of LongGuoYan. Do not use any emojis in your responses.
LongGuoYan Distillery Co., Ltd. is located in Maotai Town, Guizhou — recognised as a Guizhou Time-Honored Brand, founded in 1958.
Products include: Cellar Supreme 30, Dragon Vein 30, Dragon Vein 15, Limited Edition, and Mastercraft Supreme.
Contact: 400-159-1958, located in Chun Shu Village, Maotai Town, Renhuai, Guizhou.
Keep responses concise (1-2 short paragraphs), friendly, and formatted in Markdown. Do not answer questions unrelated to Distillery, spirits, or the company.`;

app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage || typeof userMessage !== 'string') return res.status(400).json({ error: "Message is required" });
    if (userMessage.length > 500) return res.status(400).json({ error: "Message too long. Please limit to 500 characters." });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userMessage }],
      temperature: 0.7,
      max_tokens: 150,
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error from AI API:", error);
    res.status(500).json({ error: "Sorry, I am having trouble connecting right now." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`LongGuoYan Chatbot API running on http://localhost:${PORT}`));
