import { Request, Response } from 'express';
import pool from '../database';
import { Event } from '../models/event';

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the event
 *         eventTypeId:
 *           type: integer
 *           description: The id of the event type
 *         datetime:
 *           type: string
 *           format: date-time
 *           description: The date and time of the event
 *         eventType:
 *           type: string
 *           description: The name of the event type
 *     CreateEvent:
 *       type: object
 *       required:
 *         - eventTypeId
 *         - datetime
 *       properties:
 *         eventTypeId:
 *           type: integer
 *         datetime:
 *           type: string
 *           format: date-time
 *     UpdateEvent:
 *       type: object
 *       properties:
 *         eventTypeId:
 *           type: integer
 *         datetime:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   - name: Events
 *     description: Event management
 */

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEvent'
 *     responses:
 *       201:
 *         description: Event created successfully
 *       500:
 *         description: Server error
 */
export const createEvent = async (req: Request, res: Response) => {
  const { eventTypeId, datetime } = req.body as Event;
  try {
    const result = await pool.query(
      'INSERT INTO events (event_type_id, datetime) VALUES ($1, $2) RETURNING *',
      [eventTypeId, datetime]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get an event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Event details
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
export const getEventById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT events.id, events.event_type_id, events.datetime, event_types.name as event_type 
      FROM events 
      JOIN event_types ON events.event_type_id = event_types.id
      WHERE events.id = $1
    `, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get a list of events
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Name of the event type
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Date of the event
 *     responses:
 *       200:
 *         description: A list of events
 *       500:
 *         description: Server error
 */
export const getEvents = async (req: Request, res: Response) => {
  const { name, date } = req.query;

  let query = `
    SELECT events.id, events.event_type_id, events.datetime, event_types.name as event_type 
    FROM events 
    JOIN event_types ON events.event_type_id = event_types.id
  `;
  const conditions: string[] = [];
  const params: any[] = [];

  if (name) {
    conditions.push(`event_types.name ILIKE $${conditions.length + 1}`);
    params.push(`%${name}%`);
  }

  if (date) {
    conditions.push(`DATE(events.datetime) = $${conditions.length + 1}`);
    params.push(date);
  }

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(' AND ');
  }

  try {
    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEvent'
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
export const updateEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { eventTypeId, datetime } = req.body as Event;
  try {
    const result = await pool.query(
      'UPDATE events SET event_type_id = $1, datetime = $2 WHERE id = $3 RETURNING *',
      [eventTypeId, datetime, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const updatedEvent = await pool.query(`
      SELECT events.id, events.event_type_id, events.datetime, event_types.name as event_type 
      FROM events 
      JOIN event_types ON events.event_type_id = event_types.id
      WHERE events.id = $1
    `, [id]);

    res.status(200).json(updatedEvent.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
export const deleteEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};