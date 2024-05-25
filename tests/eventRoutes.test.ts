// eventRoutes.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import eventRoutes from '../src/routes/eventRoutes';
import pool from '../src/database';
import { createEvent, getEventById, getEvents, updateEvent, deleteEvent } from '../src/controllers/eventController';

vi.mock('../src/database', () => {
  return {
    default: {
      query: vi.fn(),
    },
  };
});

const app = express();
app.use(express.json());
app.use('/api', eventRoutes);

describe('Event Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/events', () => {
    it('should create a new event', async () => {
      const newEvent = { name: 'New Event', datetime: '2024-05-25T10:00:00Z', eventTypeId: 1 };
      (pool.query as vi.Mock).mockResolvedValue({ rows: [{ id: 1, ...newEvent }] });

      const res = await request(app)
        .post('/api/events')
        .send(newEvent);

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ id: 1, ...newEvent });
    });
  });

  describe('GET /api/events/:id', () => {
    it('should get an event by ID', async () => {
      const event = { id: 1, name: 'Test Event', datetime: '2024-05-25T10:00:00Z', eventTypeId: 1 };
      (pool.query as vi.Mock).mockResolvedValue({ rows: [event] });

      const res = await request(app).get('/api/events/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(event);
    });

    it('should return 404 if event not found', async () => {
      (pool.query as vi.Mock).mockResolvedValue({ rows: [] });

      const res = await request(app).get('/api/events/999');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Event not found' });
    });
  });

  describe('GET /api/events', () => {
    it('should get a list of events', async () => {
      const events = [
        { id: 1, name: 'Event 1', datetime: '2024-05-25T10:00:00Z', eventTypeId: 1 },
        { id: 2, name: 'Event 2', datetime: '2024-05-26T10:00:00Z', eventTypeId: 2 },
      ];
      (pool.query as vi.Mock).mockResolvedValue({ rows: events });

      const res = await request(app).get('/api/events');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(events);
    });
  });

  describe('PUT /api/events/:id', () => {
    it('should update an event', async () => {
      const updatedEvent = { id: 1, name: 'Updated Event', datetime: '2024-05-25T12:00:00Z', eventTypeId: 1 };
      (pool.query as vi.Mock).mockResolvedValue({ rows: [updatedEvent] });

      const res = await request(app)
        .put('/api/events/1')
        .send(updatedEvent);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(updatedEvent);
    });

    it('should return 404 if event not found', async () => {
      (pool.query as vi.Mock).mockResolvedValue({ rows: [] });

      const res = await request(app)
        .put('/api/events/999')
        .send({ name: 'Non-existing Event' });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Event not found' });
    });
  });

  describe('DELETE /api/events/:id', () => {
    it('should delete an event', async () => {
      const deletedEvent = { id: 1, name: 'Deleted Event', datetime: '2024-05-25T10:00:00Z', eventTypeId: 1 };
      (pool.query as vi.Mock).mockResolvedValue({ rows: [deletedEvent] });

      const res = await request(app).delete('/api/events/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(deletedEvent);
    });

    it('should return 404 if event not found', async () => {
      (pool.query as vi.Mock).mockResolvedValue({ rows: [] });

      const res = await request(app).delete('/api/events/999');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Event not found' });
    });
  });
});
