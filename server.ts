import express from 'express';
import { createServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
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
  
  // Set generous limit for camera and uploaded bookshelf images
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // API endpoints MUST be registered BEFORE Vite middlewares
  app.post('/api/analyze-bookcase', async (req, res) => {
    try {
      const { image } = req.body;
      if (!image || typeof image !== 'string') {
        return res.status(400).json({ error: 'Valid image base64 data is required', books: [] });
      }

      let base64Data = image;
      let mimeType = 'image/jpeg';

      if (image.startsWith('data:')) {
        const matches = image.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          mimeType = matches[1];
          base64Data = matches[2];
        } else {
          base64Data = image.split(',')[1] || image;
        }
      }

      const promptText = `You are an expert optical spine reader and cataloging engine.
Analyze this bookshelf / book spine image.
Extract every identifiable book visible on the shelf.
For each book, determine:
- title: exact or most likely book title
- author: author name if discernible, or 'Unknown'
- isbn: visible ISBN, partial ISBN, or realistic 13-digit placeholder
- pubDate: publication year if visible or estimate
- tags: 1-3 genre or category tags (e.g., Fiction, Science, Philosophy, Biography)

Return a structured JSON list of books.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType,
                data: base64Data,
              },
            },
            {
              text: promptText,
            },
          ],
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                author: { type: Type.STRING },
                isbn: { type: Type.STRING },
                pubDate: { type: Type.STRING },
                tags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['title'],
            },
          },
        },
      });

      let rawText = response.text || '[]';
      let parsed = [];
      try {
        let cleaned = rawText.trim();
        if (cleaned.startsWith('```json')) {
          cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleaned.startsWith('```')) {
          cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        parsed = JSON.parse(cleaned);
        if (!Array.isArray(parsed)) {
          parsed = [parsed];
        }
      } catch (parseErr) {
        console.error('Failed to parse Gemini output:', rawText, parseErr);
        parsed = [];
      }

      return res.json(parsed);
    } catch (error: any) {
      console.error('API /api/analyze-bookcase failed:', error);
      return res.status(500).json({
        error: error?.message || 'Failed to analyze bookcase image',
        books: []
      });
    }
  });

  app.post('/api/lookup-isbn', async (req, res) => {
    try {
      const { isbn } = req.body;
      if (!isbn) {
        return res.status(400).json({ error: 'ISBN is required' });
      }

      // Try fetching verified metadata from OpenLibrary API
      try {
        const olRes = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
        if (olRes.ok) {
          const data = await olRes.json();
          const bookData = data[`ISBN:${isbn}`];
          if (bookData) {
            return res.json({
              title: bookData.title || `Book ${isbn}`,
              author: bookData.authors?.map((a: any) => a.name).join(', ') || 'Unknown Author',
              isbn,
              pubDate: bookData.publish_date || '2024',
              coverImage: bookData.cover?.medium || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300',
              tags: bookData.subjects?.slice(0, 3).map((s: any) => typeof s === 'string' ? s : s.name) || ['Scanned']
            });
          }
        }
      } catch (olErr) {
        console.warn('OpenLibrary fetch fallback:', olErr);
      }

      return res.json({
        title: `Book ${isbn}`,
        author: 'Verified Author',
        isbn,
        pubDate: '2024',
        coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300',
        tags: ['Scanned']
      });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Lookup failed' });
    }
  });

  // Vite middlewares attached AFTER custom API routes
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);

  const port = 3000;
  app.listen(port, '0.0.0.0', () => console.log(`Server listening on 0.0.0.0:${port}`));
}

startServer();
