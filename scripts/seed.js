require('dotenv').config({ path: './.env' });
const pool = require('../src/config/db');
const bcrypt = require('bcryptjs');

async function seed() {
  await pool.query('DELETE FROM users;');
  const adminPass = await bcrypt.hash('adminpass', 10);
  await pool.query(
    'INSERT INTO users (name, email, age, password, role) VALUES ($1, $2, $3, $4, $5)',
    ['Admin', 'admin@example.com', 30, adminPass, 'admin']
  );
  console.log('Admin seeded.');
  process.exit();
}

seed();