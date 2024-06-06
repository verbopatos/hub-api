//eventTypeRoutes.ts
import { Router } from "express";
import {
  createEventType,
  getEventTypeById,
  getEventTypes,
  updateEventType,
  deleteEventType,
} from "../controllers/eventTypeController";

const router = Router();

/**
 * @swagger
 * /event-types:
 *   post:
 *     summary: Create a new event type
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventType'
 *     responses:
 *       201:
 *         description: Event type created successfully
 *       500:
 *         description: Server error
 */
router.post("/event-types", createEventType);

/**
 * @swagger
 * /event-types/{id}:
 *   get:
 *     summary: Get an event type by ID
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
router.get("/event-types/:id", getEventTypeById);

/**
 * @swagger
 * /event-types:
 *   get:
 *     summary: Get a list of event types
 *     responses:
 *       200:
 *         description: A list of event types
 *       500:
 *         description: Server error
 */
router.get("/event-types", getEventTypes);

/**
 * @swagger
 * /event-types/{id}:
 *   put:
 *     summary: Update an event type
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
 *             $ref: '#/components/schemas/EventType'
 *     responses:
 *       200:
 *         description: Event type updated successfully
 *       404:
 *         description: Event type not found
 *       500:
 *         description: Server error
 */
router.put("/event-types/:id", updateEventType);

/**
 * @swagger
 * /event-types/{id}:
 *   delete:
 *     summary: Delete an event type
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
router.delete("/event-types/:id", deleteEventType);

export default router;
