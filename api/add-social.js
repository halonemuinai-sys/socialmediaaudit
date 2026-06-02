const pool = require('./_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { business_unit_id, platform, handle, url } = req.body;
    const result = await pool.query(`
      INSERT INTO social_audit.social_media_accounts (business_unit_id, platform, handle, url)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [business_unit_id, platform, handle, url]);

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('API Error /add-social:', error);
    res.status(500).json({ error: error.message });
  }
};
