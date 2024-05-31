// eventTypeController.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { createEventType, getEventTypeById, getEventTypes, updateEventType, deleteEventType } from '../../src/controllers/eventTypeController';
import pool from '../../src/database';

vi.mock('../../src/database', () => {
  return {
    default: {
      query: vi.fn(),
    },
  };
});

describe('Event Type Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create an event type', async () => {
    const req = {
      body: {
        name: 'Test Event Type',
      },
    } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    (pool.query as vi.Mock).mockResolvedValue({ rows: [{ id: 1, ...req.body }] });

    await createEventType(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 1, ...req.body });
  });

  it('should handle errors when creating an event type', async () => {
    const req = {
      body: {
        name: 'Test Event Type',
      },
    } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const error = new Error('Database error');
    (pool.query as vi.Mock).mockRejectedValue(error);

    await createEventType(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });

  it('should get an event type by ID', async () => {
    const req = {
      params: { id: '1' },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const eventType = {
      id: 1,
      name: 'Test Event Type',
    };

    (pool.query as vi.Mock).mockResolvedValue({ rows: [eventType] });

    await getEventTypeById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(eventType);
  });

  it('should return 404 if event type by ID is not found', async () => {
    const req = {
      params: { id: '1' },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    (pool.query as vi.Mock).mockResolvedValue({ rows: [] });

    await getEventTypeById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Event type not found' });
  });

  it('should handle errors when getting an event type by ID', async () => {
    const req = {
      params: { id: '1' },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const error = new Error('Database error');
    (pool.query as vi.Mock).mockRejectedValue(error);

    await getEventTypeById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });

  it('should get a list of event types', async () => {
    const req = {
      query: {
        name: 'Test Event Type',
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const eventTypes = [
      { id: 1, name: 'Event Type 1' },
      { id: 2, name: 'Event Type 2' },
    ];

    (pool.query as vi.Mock).mockResolvedValue({ rows: eventTypes });

    await getEventTypes(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(eventTypes);
  });

  it('should handle errors when getting a list of event types', async () => {
    const req = {
      query: {
        name: 'Test Event Type',
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const error = new Error('Database error');
    (pool.query as vi.Mock).mockRejectedValue(error);

    await getEventTypes(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });

  it('should update an event type', async () => {
    const req = {
      params: { id: '1' },
      body: {
        name: 'Updated Event Type',
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const updatedEventType = {
      id: 1,
      name: 'Updated Event Type',
    };

    (pool.query as vi.Mock).mockResolvedValueOnce({ rows: [updatedEventType] });

    await updateEventType(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedEventType);
  });

  it('should return 404 if event type to update is not found', async () => {
    const req = {
      params: { id: '999' },
      body: {
        name: 'Updated Event Type',
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    (pool.query as vi.Mock).mockResolvedValueOnce({ rows: [] });

    await updateEventType(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Event type not found' });
  });

  it('should handle errors when updating an event type', async () => {
    const req = {
      params: { id: '1' },
      body: {
        name: 'Updated Event Type',
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const error = new Error('Database error');
    (pool.query as vi.Mock).mockRejectedValue(error);

    await updateEventType(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });

  it('should delete an event type', async () => {
    const req = {
      params: { id: '1' },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const deletedEventType = {
      id: 1,
      name: 'Deleted Event Type',
    };

    (pool.query as vi.Mock).mockResolvedValue({ rows: [deletedEventType] });

    await deleteEventType(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(deletedEventType);
  });

  it('should return 404 if event type to delete is not found', async () => {
    const req = {
      params: { id: '999' },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    (pool.query as vi.Mock).mockResolvedValue({ rows: [] });

    await deleteEventType(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Event type not found' });
  });

  it('should handle errors when deleting an event type', async () => {
    const req = {
      params: { id: '1' },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const error = new Error('Database error');
    (pool.query as vi.Mock).mockRejectedValue(error);

    await deleteEventType(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });
});
