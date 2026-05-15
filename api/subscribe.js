export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Email requerido' });

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

    const status = response.status;
    if (status === 201 || status === 204 || status === 400) {
      return res.status(200).json({ ok: true });
    }

    const body = await response.text();
    return res.status(500).json({ error: body });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
