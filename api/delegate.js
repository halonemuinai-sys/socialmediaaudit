import pool from './_db.js';

export default async function handler(req, res) {
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
    const { business_unit_id, pic_name, delegated_by } = req.body;

    await pool.query(
      'UPDATE social_audit.social_media_pic_delegations SET is_active = false WHERE business_unit_id = $1',
      [business_unit_id]
    );

    const result = await pool.query(`
      INSERT INTO social_audit.social_media_pic_delegations (business_unit_id, pic_name, delegated_by)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [business_unit_id, pic_name, delegated_by]);

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('API Error /delegate:', error);
    res.status(500).json({ error: error.message });
  }
}
