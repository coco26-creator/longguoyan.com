require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `You are the Longguoyan Assistant, a knowledgeable and polite AI chatbot for Longguoyan, a premium Chinese baijiu brand. 
Longguoyan inherits millennia of crafting wisdom in Moutai Town. We craft for one year and age for five. 
Products include Longguoyan Classic 1988, Master's Reserve Z20, and Dragon Banquet Series.
Contact: +86 400-123-4567, contact@longguoyan.com, located in Guizhou Province, Moutai Town.
Keep responses concise (1-2 short paragraphs), friendly, and formatted in Markdown. Do not answer questions completely unrelated to baijiu, spirits, or the company.`;

app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    
    if (!userMessage) {
      return res.status(400).json({ error: "Message is required" });
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
    res.json({ reply });
  } catch (error) {
    console.error("Error from AI API:", error);
    res.status(500).json({ error: "Sorry, I am having trouble connecting to my brain right now. Please test my API key configuration!" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Longguoyan Chatbot API is running on http://localhost:${PORT}`);
});
