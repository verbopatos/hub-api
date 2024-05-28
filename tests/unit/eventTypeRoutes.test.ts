import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import eventTypeRoutes from '../../src/routes/eventTypeRoutes';
import pool from '../../src/database';

vi.mock('../../src/database', () => {
  return {
    default: {
      query: vi.fn(),
    },
  };
});

const app = express();
app.use(express.json());
app.use('/api', eventTypeRoutes);

describe('Event Type Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/event-types', () => {
    it('should create a new event type', async () => {
      const newEventType = { name: 'New Event Type' };
      (pool.query as vi.Mock).mockResolvedValue({ rows: [{ id: 1, ...newEventType }] });

      const res = await request(app)
        .post('/api/event-types')
        .send(newEventType);

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ id: 1, ...newEventType });
    });
  });

  describe('GET /api/event-types/:id', () => {
    it('should get an event type by ID', async () => {
      const eventType = { id: 1, name: 'Test Event Type' };
      (pool.query as vi.Mock).mockResolvedValue({ rows: [eventType] });

      const res = await request(app).get('/api/event-types/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(eventType);
    });

    it('should return 404 if event type not found', async () => {
      (pool.query as vi.Mock).mockResolvedValue({ rows: [] });

      const res = await request(app).get('/api/event-types/999');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Event type not found' });
    });
  });

  describe('GET /api/event-types', () => {
    it('should get a list of event types', async () => {
      const eventTypes = [
        { id: 1, name: 'Event Type 1' },
        { id: 2, name: 'Event Type 2' },
      ];
      (pool.query as vi.Mock).mockResolvedValue({ rows: eventTypes });

      const res = await request(app).get('/api/event-types');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(eventTypes);
    });
  });

  describe('PUT /api/event-types/:id', () => {
    it('should update an event type', async () => {
      const updatedEventType = { id: 1, name: 'Updated Event Type' };
      (pool.query as vi.Mock).mockResolvedValue({ rows: [updatedEventType] });

      const res = await request(app)
        .put('/api/event-types/1')
        .send(updatedEventType);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(updatedEventType);
    });

    it('should return 404 if event type not found', async () => {
      (pool.query as vi.Mock).mockResolvedValue({ rows: [] });

      const res = await request(app)
        .put('/api/event-types/999')
        .send({ name: 'Non-existing Event Type' });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Event type not found' });
    });
  });

  describe('DELETE /api/event-types/:id', () => {
    it('should delete an event type', async () => {
      const deletedEventType = { id: 1, name: 'Deleted Event Type' };
      (pool.query as vi.Mock).mockResolvedValue({ rows: [deletedEventType] });

      const res = await request(app).delete('/api/event-types/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(deletedEventType);
    });

    it('should return 404 if event type not found', async () => {
      (pool.query as vi.Mock).mockResolvedValue({ rows: [] });

      const res = await request(app).delete('/api/event-types/999');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Event type not found' });
    });
  });
});
