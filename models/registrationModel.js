import { pool } from './db.js';

export const isAlreadyRegistered = async (userId, eventId) => {
  const result = await pool.query(
    `SELECT * FROM registrations WHERE user_id = $1 AND event_id = $2`,
    [userId, eventId]
  );
  return result.rowCount > 0;
};

export const getRegistrationCount = async (eventId) => {
  const result = await pool.query(
    `SELECT COUNT(*) FROM registrations WHERE event_id = $1`,
    [eventId]
  );
  return parseInt(result.rows[0].count);
};

export const registerUserToEvent = async (userId, eventId) => {
  const result = await pool.query(
    `INSERT INTO registrations (user_id, event_id)
     VALUES ($1, $2) RETURNING *`,
    [userId, eventId]
  );
  return result.rows[0];
};

export const cancelRegistration = async (userId, eventId) => {
  const result = await pool.query(
    `DELETE FROM registrations WHERE user_id = $1 AND event_id = $2 RETURNING *`,
    [userId, eventId]
  );
  return result.rowCount;
};
