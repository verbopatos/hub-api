import { Request, Response } from 'express';
import pool from '../database';
import { EventType } from '../models/eventType';

/**
 * @swagger
 * components:
 *   schemas:
 *     EventType:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the event type
 *         name:
 *           type: string
 *           description: The name of the event type
 *     CreateEventType:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *     UpdateEventType:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   - name: EventTypes
 *     description: Event type management
 */

/**
 * @swagger
 * /event-types:
 *   post:
 *     summary: Create a new event type
 *     tags: [EventTypes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEventType'
 *     responses:
 *       201:
 *         description: Event type created successfully
 *       500:
 *         description: Server error
 */
export const createEventType = async (req: Request, res: Response) => {
    const { name } = req.body as EventType;
    try {
        const result = await pool.query(
            'INSERT INTO event_types (name) VALUES ($1) RETURNING *',
            [name]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

/**
 * @swagger
 * /event-types/{id}:
 *   get:
 *     summary: Get an event type by ID
 *     tags: [EventTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Event type details
 *       404:
 *         description: Event type not found
 *       500:
 *         description: Server error
 */
export const getEventTypeById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM event_types WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Event type not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

/**
 * @swagger
 * /event-types:
 *   get:
 *     summary: Get a list of event types
 *     tags: [EventTypes]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Name of the event type
 *     responses:
 *       200:
 *         description: A list of event types
 *       500:
 *         description: Server error
 */
export const getEventTypes = async (req: Request, res: Response) => {
    const { name } = req.query;

    let query = 'SELECT * FROM event_types';
    const conditions: string[] = [];
    const params: any[] = [];

    if (name) {
        conditions.push(`name ILIKE $${conditions.length + 1}`);
        params.push(`%${name}%`);
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
 * /event-types/{id}:
 *   put:
 *     summary: Update an event type
 *     tags: [EventTypes]
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
 *             $ref: '#/components/schemas/UpdateEventType'
 *     responses:
 *       200:
 *         description: Event type updated successfully
 *       404:
 *         description: Event type not found
 *       500:
 *         description: Server error
 */
export const updateEventType = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body as EventType;
    try {
        const result = await pool.query(
            'UPDATE event_types SET name = $1 WHERE id = $2 RETURNING *',
            [name, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Event type not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

/**
 * @swagger
 * /event-types/{id}:
 *   delete:
 *     summary: Delete an event type
 *     tags: [EventTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Event type deleted successfully
 *       404:
 *         description: Event type not found
 *       500:
 *         description: Server error
 */
export const deleteEventType = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM event_types WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Event type not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
