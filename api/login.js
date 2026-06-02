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
    const { username, password } = req.body;
    const result = await pool.query(
      'SELECT id, name, username, department, role, sector FROM social_audit.users WHERE username = $1 AND password = $2',
      [username, password]
    );

    if (result.rows.length > 0) {
      res.status(200).json({ success: true, user: result.rows[0] });
    } else {
      res.status(401).json({ success: false, message: 'Username atau password salah!' });
    }
  } catch (error) {
    console.error('API Error /login:', error);
    res.status(500).json({ error: error.message });
  }
}
