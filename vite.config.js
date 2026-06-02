import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { Pool } from 'pg'

// Muat variabel lingkungan dari .env secara manual untuk Vite server middleware
const envPath = path.resolve(__dirname, '.env')
let databaseUrl = "postgresql://postgres.dfughwonwxowjjgfvhxu:Kmzway87aa%21%21@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres?schema=social_audit"

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  const match = envContent.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/)
  if (match && match[1]) {
    databaseUrl = match[1]
  }
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false }
});

// Emulator Vercel Serverless Function untuk jalankan /api/ secara lokal lewat Vite
function vercelApiPlugin() {
  return {
    name: 'vercel-api-emulator',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url.startsWith('/api/')) {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

          if (req.method === 'OPTIONS') {
            res.statusCode = 200;
            res.end();
            return;
          }

          const url = new URL(req.url, `http://${req.headers.host}`);
          const action = url.pathname.split('/').pop();

          // Ambil body request untuk POST
          let body = '';
          req.on('data', chunk => { body += chunk; });
          await new Promise(resolve => req.on('end', resolve));
          const postData = body ? JSON.parse(body) : {};

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
              const usersRes = await pool.query('SELECT id, name, username, department, role, sector FROM social_audit.users');

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                units: unitsRes.rows,
                socials: socialsRes.rows,
                pics: picsRes.rows,
                audits: auditsRes.rows,
                users: usersRes.rows
              }));
              return;
            }

            if (req.method === 'POST' && action === 'login') {
              const { username, password } = postData;
              const result = await pool.query(
                'SELECT id, name, username, department, role, sector FROM social_audit.users WHERE username = $1 AND password = $2',
                [username, password]
              );
              
              res.setHeader('Content-Type', 'application/json');
              if (result.rows.length > 0) {
                res.end(JSON.stringify({ success: true, user: result.rows[0] }));
              } else {
                res.statusCode = 401;
                res.end(JSON.stringify({ success: false, message: 'Username atau password salah!' }));
              }
              return;
            }

            if (req.method === 'POST' && action === 'delegate') {
              const { business_unit_id, pic_name, delegated_by } = postData;
              
              await pool.query(
                'UPDATE social_audit.social_media_pic_delegations SET is_active = false WHERE business_unit_id = $1',
                [business_unit_id]
              );

              const result = await pool.query(`
                INSERT INTO social_audit.social_media_pic_delegations (business_unit_id, pic_name, delegated_by)
                VALUES ($1, $2, $3)
                RETURNING *
              `, [business_unit_id, pic_name, delegated_by]);
              
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result.rows[0]));
              return;
            }

            if (req.method === 'POST' && action === 'audit') {
              const { account_id, last_password_changed_at, has_two_factor_auth, password_strength, vulnerabilities_notes, status, audited_by_user_id } = postData;
              
              const result = await pool.query(`
                INSERT INTO social_audit.social_media_audit_logs (account_id, last_password_changed_at, has_two_factor_auth, password_strength, vulnerabilities_notes, status, audited_by_user_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *
              `, [account_id, last_password_changed_at, has_two_factor_auth, password_strength, vulnerabilities_notes, status, audited_by_user_id]);

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result.rows[0]));
              return;
            }

            // Baru: Tambah Akun Sosial Media secara manual
            if (req.method === 'POST' && action === 'add-social') {
              const { business_unit_id, platform, handle, url } = postData;
              const result = await pool.query(`
                INSERT INTO social_audit.social_media_accounts (business_unit_id, platform, handle, url)
                VALUES ($1, $2, $3, $4)
                RETURNING *
              `, [business_unit_id, platform, handle, url]);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result.rows[0]));
              return;
            }

            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Not Found' }));
          } catch (err) {
            console.error("DATABASE API ERROR:", err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
        } else {
          next();
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), vercelApiPlugin()],
})
