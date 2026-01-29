
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
    const { url, createdAt } = req.body;
    if (!url) {
      res.status(400).json({ error: 'URL is required' });
      return;
    }

    const code = generateCode();

    // If createdAt is not provided, generate a default Malaysia time
    const defaultTime = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kuala_Lumpur',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(',', '');

    await pool.query('INSERT INTO links (code, original_url, created_at) VALUES (?, ?, ?)', [code, url, createdAt || defaultTime]);

    const shortUrl = `${backend_url}:${port}/${code}`;
    res.json({ shortUrl, code, originalUrl: url });
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
      createdAt: row.created_at
    }));

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /:id - Delete URL based on ID
app.delete('/delete/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    const links = rows as any[];

    if (links.length === 0) {
      res.status(404).json({ error: 'Link not found' });
      return;
    }

    const link = links[0];
    pool.query('DELETE FROM links WHERE id = ?', [link.id]);

    res.json({ message: 'Link deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/', (req, res) => {
  res.send('Backend is Running!')
})

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

    let originalUrl = link.original_url;
    // Check if protocol exists, if not prepend http://
    if (!/^https?:\/\//i.test(originalUrl)) {
      originalUrl = 'http://' + originalUrl;
    }

    res.redirect(originalUrl);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.listen(port, () => {
  console.log(`Linkly Backend listening on port ${port}`)
})