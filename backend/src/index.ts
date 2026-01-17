
import express, { Request, Response } from "express";
import cors from 'cors';
import 'dotenv/config';
import pool, { initDb } from './db';

const app = express()
const backend_url = process.env.URL || "http://localhost"
const port = process.env.PORT || 3000

app.use(cors());
app.use(express.json());

initDb();

// Generate random string
const generateCode = (length: number = 6): string => {
  return Math.random().toString(36).substring(2, 2 + length);
}

// POST /shorten
app.post('/shorten', async (req: Request, res: Response): Promise<void> => {
  try {
    const { url } = req.body;
    if (!url) {
      res.status(400).json({ error: 'URL is required' });
      return;
    }

    const code = generateCode();
    await pool.query('INSERT INTO links (code, original_url) VALUES (?, ?)', [code, url]);

    const shortUrl = `${backend_url}:${port}/${code}`;
    res.json({ shortUrl, code, originalUrl: url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /links - Recent links
app.get('/links', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM links ORDER BY created_at DESC LIMIT 10');
    const formatted = (rows as any[]).map(row => ({
      id: row.id,
      shortUrl: `${backend_url}:${port}/${row.code}`,
      originalUrl: row.original_url,
      clicks: row.clicks,
      createdAt: new Date(row.created_at).toLocaleString()
    }));

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /links/info - Get info based on codes
app.post('/links/info', async (req: Request, res: Response): Promise<void> => {
  try {
    const { codes } = req.body;
    if (!Array.isArray(codes) || codes.length === 0) {
      res.json([]);
      return;
    }

    const placeholders = codes.map(() => '?').join(',');
    const query = `SELECT * FROM links WHERE code IN (${placeholders}) ORDER BY created_at DESC`;

    const [rows] = await pool.query(query, codes);
    const formatted = (rows as any[]).map(row => ({
      id: row.id,
      shortUrl: `${backend_url}:${port}/${row.code}`,
      originalUrl: row.original_url,
      clicks: row.clicks,
      createdAt: new Date(row.created_at).toLocaleString()
    }));

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /:code - Redirect
app.get('/:code', async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.params;
    const [rows] = await pool.query('SELECT * FROM links WHERE code = ?', [code]);
    const links = rows as any[];

    if (links.length === 0) {
      res.status(404).send('Link not found');
      return;
    }

    const link = links[0];

    // Update clicks
    pool.query('UPDATE links SET clicks = clicks + 1 WHERE id = ?', [link.id]);

    res.redirect(link.original_url);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.get('/', (req, res) => {
  res.send('Backend is Running!')
})

app.listen(port, () => {
  console.log(`Linkly Backend listening on port ${port}`)
})