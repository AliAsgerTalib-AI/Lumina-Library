import express from 'express';
import { createServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: { 'User-Agent': 'aistudio-build' }
  }
});

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);

  app.post('/api/analyze-bookcase', async (req, res) => {
    const { image } = req.body;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          { text: 'Analyze this image of a bookshelf. Extract a list of books with title, author, and ISBN if visible. Return as a JSON array.' },
          { inlineData: { mimeType: 'image/jpeg', data: image } }
        ],
        config: { responseMimeType: 'application/json' }
      });
      res.json(JSON.parse(response.text || '[]'));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to analyze bookshelf' });
    }
  });

  app.listen(3000, () => console.log('Server running on port 3000'));
}

startServer();
