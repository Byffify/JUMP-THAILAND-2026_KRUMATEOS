/* ==========================================================================
   KruMate OS — Gemini API proxy (Vercel Serverless Function)
   ถือ GEMINI_API_KEY ฝั่ง Server เท่านั้น — key ไม่ถูกส่งลง client bundle
   Client เรียก POST /api/gemini { prompt, model?, temperature?, maxOutputTokens? }
   ========================================================================== */

const DEFAULT_MODEL = 'gemini-3.5-flash-lite';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(503).json({ ok: false, error: 'Server has no GEMINI_API_KEY configured' });
    return;
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    res.status(400).json({ ok: false, error: 'Invalid JSON body' });
    return;
  }

  const {
    prompt,
    model = DEFAULT_MODEL,
    temperature = 0.7,
    maxOutputTokens = 4096,
  } = body || {};

  if (!prompt || typeof prompt !== 'string') {
    res.status(400).json({ ok: false, error: 'Missing or invalid prompt' });
    return;
  }
  if (prompt.length > 10000) {
    res.status(400).json({ ok: false, error: 'Prompt too long' });
    return;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature, maxOutputTokens },
      }),
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      console.error('Gemini upstream error', upstream.status, JSON.stringify(data).slice(0, 2000));
      res.status(502).json({ ok: false, error: `Gemini API error ${upstream.status}` });
      return;
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    res.status(200).json({ ok: true, text });
  } catch (err) {
    console.error('Gemini proxy failure', err);
    res.status(500).json({ ok: false, error: 'Gemini proxy failure' });
  }
}