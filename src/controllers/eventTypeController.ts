// eventTypeController.ts
import { Request, Response } from "express";
import { EventType } from "../models/eventType";
import {
  create,
  getById,
  getMany,
  remove,
  update,
} from "../services/eventTypeService";

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
 *       required: true
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
    const result = await create({
      name,
    });

    res.status(201).json(result);
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
    const result = await getById(Number(id));

    if (!result) {
      return res.status(404).json({ message: "Event type not found" });
    }

    res.status(200).json(result);
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

  const conditions: any[] = [];

  if (name) {
    conditions.push({
      name: {
        contains: name as string,
        mode: "insensitive",
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
    const existingEvent = await getById(Number(id));

    if (!existingEvent) {
      return res.status(404).json({ message: "Event type not found" });
    }

    const result = await update(Number(id), { name });

    res.status(200).json(result);
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
    const existingEvent = await getById(Number(id));

    if (!existingEvent) {
      return res.status(404).json({ message: "Event type not found" });
    }

    const result = await remove(Number(id));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
// Path: src/controllers/eventController.ts
