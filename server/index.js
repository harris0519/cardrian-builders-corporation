import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';
import { validateInquiry, sendInquiry } from './inquiry.js';

export function createInquiryServer({ apiKey = process.env.BREVO_API_KEY, origins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',').map(value => value.trim()), send = sendInquiry } = {}) {
  const attempts = new Map();
  return createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Vary', 'Origin');
    const respond = (status, message) => { res.writeHead(status); res.end(JSON.stringify(message)); };
    if (req.url !== '/api/inquiry') return respond(404, { success: false });
    if (req.headers.origin && !origins.includes(req.headers.origin)) return respond(403, { success: false });
    if (req.headers.origin) res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Methods', 'POST');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.writeHead(204); return res.end();
    }
    if (req.method !== 'POST') { res.setHeader('Allow', 'POST, OPTIONS'); return respond(405, { success: false }); }
    if (!req.headers['content-type']?.toLowerCase().startsWith('application/json')) return respond(415, { success: false });
    const now = Date.now();
    for (const [key, entry] of attempts) if (entry.expires <= now) attempts.delete(key);
    const address = req.socket.remoteAddress;
    const entry = attempts.get(address) || { count: 0, expires: now + 60000 };
    attempts.set(address, entry);
    if (++entry.count > 5) { res.setHeader('Retry-After', '60'); return respond(429, { success: false }); }
    let body;
    try {
      const chunks = []; let size = 0;
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 32768) return respond(413, { success: false });
        chunks.push(chunk);
      }
      body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch { return respond(400, { success: false }); }
    if (body?._honey) return respond(200, { success: true });
    let inquiry;
    try { inquiry = validateInquiry(body); }
    catch (error) { return respond(400, { success: false, message: error.message }); }
    if (!apiKey) return respond(503, { success: false });
    try { await send(inquiry, apiKey); return respond(200, { success: true }); }
    catch { return respond(502, { success: false, message: 'Unable to send your inquiry right now.' }); }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT || 3001);
  createInquiryServer().listen(port, () => console.log(`Inquiry API listening on port ${port}`));
}
