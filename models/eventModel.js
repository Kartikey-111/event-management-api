import { pool } from './db.js';

export const createEvent = async (title, datetime, location, capacity) => {
  const result = await pool.query(
    `INSERT INTO events (title, datetime, location, capacity)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [title, datetime, location, capacity]
  );
  return result.rows[0];
};

export const getEventById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM events WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

export const getEventWithUsers = async (eventId) => {
  const eventQuery = await pool.query(`SELECT * FROM events WHERE id = $1`, [eventId]);
  const usersQuery = await pool.query(
    `SELECT u.id, u.name, u.email
     FROM registrations r
     JOIN users u ON r.user_id = u.id
     WHERE r.event_id = $1`,
    [eventId]
  );
  return {
    event: eventQuery.rows[0],
    registeredUsers: usersQuery.rows
  };
};

export const getUpcomingEvents = async () => {
  const result = await pool.query(
    `SELECT * FROM events
     WHERE datetime > NOW()
     ORDER BY datetime ASC, location ASC`
  );
  return result.rows;
};

export const getEventStats = async (eventId) => {
  const event = await getEventById(eventId);
  const registered = await pool.query(
    `SELECT COUNT(*) FROM registrations WHERE event_id = $1`,
    [eventId]
  );
  const count = parseInt(registered.rows[0].count);
  return {
    total: count,
    remaining: event.capacity - count,
    percentage: ((count / event.capacity) * 100).toFixed(2)
  };
};
