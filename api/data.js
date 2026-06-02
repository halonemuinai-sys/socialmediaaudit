import pool from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const unitsRes = await pool.query('SELECT * FROM social_audit.business_units ORDER BY name ASC');
    const socialsRes = await pool.query('SELECT * FROM social_audit.social_media_accounts');
    const picsRes = await pool.query(`
      SELECT p.* 
      FROM social_audit.social_media_pic_delegations p
      WHERE p.is_active = true
    `);
    const auditsRes = await pool.query('SELECT * FROM social_audit.social_media_audit_logs');
    const usersRes = await pool.query('SELECT id, name, email, department, role, sector FROM social_audit.users');

    res.status(200).json({
      units: unitsRes.rows,
      socials: socialsRes.rows,
      pics: picsRes.rows,
      audits: auditsRes.rows,
      users: usersRes.rows
    });
  } catch (error) {
    console.error('API Error /data:', error);
    res.status(500).json({ error: error.message });
  }
}
