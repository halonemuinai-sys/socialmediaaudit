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
    const { account_id, last_password_changed_at, has_two_factor_auth, password_strength, vulnerabilities_notes, status, audited_by_user_id } = req.body;

    const result = await pool.query(`
      INSERT INTO social_audit.social_media_audit_logs (account_id, last_password_changed_at, has_two_factor_auth, password_strength, vulnerabilities_notes, status, audited_by_user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [account_id, last_password_changed_at, has_two_factor_auth, password_strength, vulnerabilities_notes, status, audited_by_user_id]);

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('API Error /audit:', error);
    res.status(500).json({ error: error.message });
  }
};
