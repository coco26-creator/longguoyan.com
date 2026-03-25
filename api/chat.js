require('dotenv').config();
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `You are the LongGuoYan Assistant, a knowledgeable and polite AI chatbot for LongGuoYan, a premium Chinese baijiu brand. 
LongGuoYan inherits millennia of crafting wisdom in Maotai Town, Guizhou. 
Products include Cellar Supreme 30, Dragon Vein Series, Limited Editions, Commemorative 1958, and Collector's Reserve.
Contact: 400-159-1958, located in Chun Shu Village, Maotai Town, Renhuai, Guizhou.
Keep responses concise (1-2 short paragraphs), friendly, and formatted in Markdown. Do not answer questions completely unrelated to baijiu, spirits, or the company.`;

module.exports = async function handler(req, res) {
  // Setup CORS Headers for Vercel
  // Permissive CORS for debugging live issues
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight CORS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userMessage = req.body.message;
    
    if (!userMessage || typeof userMessage !== 'string') {
      return res.status(400).json({ error: "Message is required and must be text" });
    }

    if (userMessage.length > 500) {
      return res.status(400).json({ error: "Message is too long. Please keep it under 500 characters." });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    const reply = completion.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error("Error from AI API:", error);
    // Return 200 so the chatbot can show the error instead of hitting a CORS/network block
    res.status(200).json({ error: "Backend Connected! But AI Brain failed: " + (error.message || "Check your OpenAI API Key in Vercel settings.") });
  }
};
