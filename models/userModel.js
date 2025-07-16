import { pool } from './db.js';

export const createUserIfNotExists = async (name, email) => {
  const existing = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
  if (existing.rows.length > 0) return existing.rows[0];

  const result = await pool.query(
    `INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *`,
    [name, email]
  );
  return result.rows[0];
};
