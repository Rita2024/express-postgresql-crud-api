const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const getAllUsers = async () => {
  const result = await pool.query('SELECT id, name, email, age, role FROM users ORDER BY id ASC');
  return result.rows;
};

const getUserById = async (id) => {
  const result = await pool.query('SELECT id, name, email, age, role FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

const createUser = async ({ name, email, age, password, role }) => {
  const hashed = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (name, email, age, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, age, role',
    [name, email, age, hashed, role || 'user']
  );
  return result.rows[0];
};

const updateUser = async (id, { name, email, age }) => {
  const result = await pool.query(
    'UPDATE users SET name = $1, email = $2, age = $3 WHERE id = $4 RETURNING id, name, email, age, role',
    [name, email, age, id]
  );
  return result.rows[0];
};

const deleteUser = async (id) => {
  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
  return result.rows[0];
};

const findByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const setRefreshToken = async (userId, refreshToken) => {
  await pool.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [refreshToken, userId]);
};

const getRefreshToken = async (userId) => {
  const result = await pool.query('SELECT refresh_token FROM users WHERE id = $1', [userId]);
  return result.rows[0] ? result.rows[0].refresh_token : null;
};

const updatePassword = async (id, newPassword) => {
  const hashed = await bcrypt.hash(newPassword, 10);
  await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashed, id]);
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  findByEmail,
  setRefreshToken,
  getRefreshToken,
  updatePassword
};