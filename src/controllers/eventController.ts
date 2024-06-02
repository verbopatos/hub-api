// eventController.ts
import { Request, Response } from "express";
import { Event } from "../models/event";
import {
  create,
  getById,
  getMany,
  remove,
  update,
} from "../services/eventService";

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
    const result = await create({
      datetime,
      eventTypeId,
    });

    res.status(201).json(result);
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
    const result = await getById(Number(id));

    if (!result) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(result);
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

  const conditions: any[] = [];

  if (name) {
    conditions.push({
      event_types: {
        name: {
          contains: name as string,
          mode: "insensitive",
        },
      },
    });
  }

  if (date) {
    const startDate = new Date(date as string);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    conditions.push({
      datetime: {
        gte: startDate,
        lt: endDate,
      },
    });
  }

  const filteredConditions = conditions.filter(Boolean);

  try {
    const result = await getMany(filteredConditions);

    res.status(200).json(result);
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
    const existingEvent = await getById(Number(id));

    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    const result = await update(Number(id), { eventTypeId, datetime });

    res.status(200).json(result);
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
    const existingEvent = await getById(Number(id));

    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    const result = await remove(Number(id));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Path: src/controllers/eventController.ts
