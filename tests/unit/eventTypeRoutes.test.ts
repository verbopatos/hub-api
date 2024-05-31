import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import request from 'supertest';
import express from 'express';
import eventTypeRoutes from '../../src/routes/eventTypeRoutes';
import * as eventTypeService from '../../src/services/eventTypeService';

vi.mock('../../src/services/eventTypeService');

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

      const createdEventType = {
        id: 1,
        ...newEventType,
      };

      (eventTypeService.create as Mock).mockResolvedValue(createdEventType);

      const res = await request(app)
        .post('/api/event-types')
        .send({ ...newEventType });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(createdEventType);
    });
  });

  describe('GET /api/event-types/:id', () => {
    it('should get an event type by ID', async () => {
      const eventType = { id: 1, name: 'Test Event Type' };

      (eventTypeService.getById as Mock).mockResolvedValue(eventType);

      const res = await request(app).get('/api/event-types/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(eventType);
    });

    it('should return 404 if event type not found', async () => {
      (eventTypeService.getById as Mock).mockResolvedValue(null);

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
      (eventTypeService.getMany as Mock).mockResolvedValue(eventTypes);

      const res = await request(app).get('/api/event-types');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(eventTypes);
    });
  });

  describe('PUT /api/event-types/:id', () => {
    it('should update an event type', async () => {
      const updatedEventType = { id: 1, name: 'Updated Event Type' };

      (eventTypeService.getById as Mock).mockResolvedValue({ id: 1 });
      (eventTypeService.update as Mock).mockResolvedValue(updatedEventType);

      const res = await request(app).put('/api/event-types/1').send(updatedEventType);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(updatedEventType);
    });

    it('should return 404 if event type not found', async () => {
      (eventTypeService.getById as Mock).mockResolvedValue(null);

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

      (eventTypeService.getById as Mock).mockResolvedValue({ id: 1 });
      (eventTypeService.remove as Mock).mockResolvedValue(deletedEventType);

      const res = await request(app).delete('/api/event-types/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(deletedEventType);
    });

    it('should return 404 if event type not found', async () => {
      (eventTypeService.getById as Mock).mockResolvedValue(null);

      const res = await request(app).delete('/api/event-types/999');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Event type not found' });
    });
  });
});
