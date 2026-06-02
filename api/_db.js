import pg from 'pg';
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || "postgresql://postgres.dfughwonwxowjjgfvhxu:Kmzway87aa%21%21@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

export default pool;
