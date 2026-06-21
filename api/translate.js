export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'text required' });

  try {
    const response = await fetch('https://api.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: [text],
        target_lang: 'KO',
        source_lang: 'EN'
      })
    });

    const data = await response.json();
    const translation = data.translations?.[0]?.text;
    if (!translation) return res.status(500).json({ error: 'no translation' });
    res.status(200).json({ translation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}