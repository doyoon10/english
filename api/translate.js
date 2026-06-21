export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'text required' });

  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'DEEPL_API_KEY not set' });

  try {
    // DeepL 무료 플랜은 api-free.deepl.com, 유료는 api.deepl.com
    const endpoint = apiKey.endsWith(':fx')
      ? 'https://api-free.deepl.com/v2/translate'
      : 'https://api.deepl.com/v2/translate';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: [text],
        target_lang: 'KO',
        source_lang: 'EN'
      })
    });

    const data = await response.json();
    console.log('DeepL response:', JSON.stringify(data));

    if (!response.ok) return res.status(500).json({ error: data });
    const translation = data.translations?.[0]?.text;
    if (!translation) return res.status(500).json({ error: 'no translation in response' });
    res.status(200).json({ translation });
  } catch (err) {
    console.error('DeepL error:', err);
    res.status(500).json({ error: err.message });
  }
}