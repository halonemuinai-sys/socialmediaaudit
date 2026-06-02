const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || "postgresql://postgres.dfughwonwxowjjgfvhxu:Kmzway87aa%21%21@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const action = pathname.split('/').pop();

  try {
    if (req.method === 'GET' && action === 'data') {
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
      return;
    }

    if (req.method === 'POST' && action === 'login') {
      const { email, password } = req.body;
      const result = await pool.query(
        'SELECT id, name, email, department, role, sector FROM social_audit.users WHERE email = $1 AND password = $2',
        [email, password]
      );
      
      if (result.rows.length > 0) {
        res.status(200).json({ success: true, user: result.rows[0] });
      } else {
        res.status(401).json({ success: false, message: 'Email atau password salah!' });
      }
      return;
    }

    if (req.method === 'POST' && action === 'delegate') {
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
      return;
    }

    if (req.method === 'POST' && action === 'audit') {
      const { account_id, last_password_changed_at, has_two_factor_auth, password_strength, vulnerabilities_notes, status, audited_by_user_id } = req.body;
      
      const result = await pool.query(`
        INSERT INTO social_audit.social_media_audit_logs (account_id, last_password_changed_at, has_two_factor_auth, password_strength, vulnerabilities_notes, status, audited_by_user_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `, [account_id, last_password_changed_at, has_two_factor_auth, password_strength, vulnerabilities_notes, status, audited_by_user_id]);

      res.status(200).json(result.rows[0]);
      return;
    }

    if (req.method === 'POST' && action === 'add-social') {
      const { business_unit_id, platform, handle, url } = req.body;
      const result = await pool.query(`
        INSERT INTO social_audit.social_media_accounts (business_unit_id, platform, handle, url)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `, [business_unit_id, platform, handle, url]);
      res.status(200).json(result.rows[0]);
      return;
    }

    res.status(404).json({ error: 'Endpoint tidak ditemukan' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
