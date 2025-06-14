require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT
});

/* pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ DB Error:', err);
  } else {
    console.log('✅ DB is working:', res.rows[0]);
  }
}); */

module.exports = pool;