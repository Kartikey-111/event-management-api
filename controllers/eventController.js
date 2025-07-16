import {
  createEvent,
  getEventById,
  getEventWithUsers,
  getUpcomingEvents,
  getEventStats
} from "../models/eventModel.js";

import {
  createUserIfNotExists
} from "../models/userModel.js";

import {
  isAlreadyRegistered,
  getRegistrationCount,
  registerUserToEvent,
  cancelRegistration
} from "../models/registrationModel.js";

import { pool } from '../models/db.js';

export const createEventHandler = async (req, res) => {
  const { title, datetime, location, capacity } = req.body;

  if (!title || !datetime || !location || !capacity) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (capacity <= 0 || capacity > 1000) {
    return res.status(400).json({ error: "Capacity must be between 1 and 1000" });
  }

  try {
    const event = await createEvent(title, datetime, location, capacity);
    res.status(201).json({ eventId: event.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getEventDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await getEventWithUsers(id);
    if (!data.event) return res.status(404).json({ error: "Event not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const registerHandler = async (req, res) => {
  const { name, email } = req.body;
  const eventId = req.params.id;

  if (!name || !email) return res.status(400).json({ error: "Name and email required" });

  try {
    const event = await getEventById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    if (new Date(event.datetime) < new Date()) {
      return res.status(400).json({ error: "Cannot register for past event" });
    }

    const user = await createUserIfNotExists(name, email);
    const already = await isAlreadyRegistered(user.id, eventId);
    if (already) return res.status(400).json({ error: "User already registered" });

    const count = await getRegistrationCount(eventId);
    if (count >= event.capacity) {
      return res.status(400).json({ error: "Event is full" });
    }

    await registerUserToEvent(user.id, eventId);
    res.json({ message: "Registration successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const cancelHandler = async (req, res) => {
  const { email } = req.body;
  const eventId = req.params.id;

  try {
    const user = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (user.rows.length === 0) return res.status(404).json({ error: "User not found" });

    const result = await cancelRegistration(user.rows[0].id, eventId);
    if (result === 0) return res.status(400).json({ error: "User not registered for this event" });

    res.json({ message: "Registration cancelled" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getUpcoming = async (req, res) => {
  try {
    const events = await getUpcomingEvents();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const statsHandler = async (req, res) => {
  const eventId = req.params.id;
  try {
    const stats = await getEventStats(eventId);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
