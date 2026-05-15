export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  let email;
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    email = body?.email;
  } catch (e) {
    return res.status(400).json({ error: 'Body inválido' });
  }

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': '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',
      },
      body: JSON.stringify({ email, listIds: [2], updateEnabled: true }),
    });

    if (response.status === 201 || response.status === 204 || response.status === 400) {
      return res.status(200).json({ ok: true });
    }

    const text = await response.text();
    console.error('Brevo error:', response.status, text);
    return res.status(500).json({ error: text });

  } catch (e) {
    console.error('Fetch error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
