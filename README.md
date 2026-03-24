# LongGuoYan Chatbot Deployment Guide

To make the chatbot work on your live site (**GitHub Pages**), you must deploy the backend code to **Vercel**. 

## Step 1: Deploy the Backend to Vercel
1. Log into [Vercel](https://vercel.com).
2. Click **"Add New"** > **"Project"**.
3. Import your GitHub repository (`longguoyan.com`).
4. **Environment Variables**: In the Vercel project settings, add:
   - `OPENAI_API_KEY`: Your real OpenAI secret key.
5. Click **Deploy**.

## Step 2: Get your live URL
1. Once deployed, Vercel will give you a domain (e.g., `https://longguoyan-chat.vercel.app`).
2. Copy this URL.

## Step 3: Update Chatbot Settings
1. Open `chatbot.js` in your code editor.
2. Find line **74**:
   ```javascript
   const VERCEL_URL = 'https://your-app-name.vercel.app/api/chat';
   ```
3. Replace the placeholder with your NEW Vercel URL (keep the `/api/chat` at the end).
4. Save, commit, and push to GitHub.

---

### Local Development
If you want to test the chatbot on your computer:
1. Run `node server.js` in your terminal.
2. The chatbot will automatically detect `localhost` and connect to your computer instead of Vercel!