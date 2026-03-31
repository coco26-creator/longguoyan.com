require('dotenv').config();
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const systemPrompt = `You are the LongGuoYan Assistant, a knowledgeable and polite AI chatbot for LongGuoYan, a premium Chinese baijiu brand.
LongGuoYan Distillery Co., Ltd. is located in Maotai Town, Guizhou — recognised as a Guizhou Time-Honored Brand, founded in 1958.
Products include: Cellar Supreme 30, Dragon Vein 30, Dragon Vein 15, Limited Edition, and Mastercraft Supreme.
Contact: 400-159-1958, located in Chun Shu Village, Maotai Town, Renhuai, Guizhou.
Keep responses concise (1-2 short paragraphs), friendly, and formatted in Markdown. Do not answer questions unrelated to baijiu, spirits, or the company.`;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const userMessage = req.body.message;
    if (!userMessage || typeof userMessage !== 'string') return res.status(400).json({ error: "Message is required and must be text" });
    if (userMessage.length > 500) return res.status(400).json({ error: "Message too long. Please keep it under 500 characters." });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userMessage }],
      temperature: 0.7,
      max_tokens: 150,
    });
    res.status(200).json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error from AI API:", error);
    res.status(200).json({ error: "Backend connected! But AI failed: " + (error.message || "Check your OpenAI API Key in Vercel settings.") });
  }
};
