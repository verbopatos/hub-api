// eventController.test.ts - This file contains tests for the event controller functions.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { createEvent, getEventById, getEvents, updateEvent, deleteEvent } from '../../src/controllers/eventController';
import pool from '../../src/database';

vi.mock('../src/database', () => {
  return {
    default: {
      query: vi.fn(),
    },
  };
});

describe('Event Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create an event', async () => {
    const req = {
      body: {
        eventTypeId: 1,
        datetime: new Date(),
      },
    } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    (pool.query as vi.Mock).mockResolvedValue({ rows: [{ id: 1, ...req.body }] });

    await createEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 1, ...req.body });
  });

  it('should handle errors when creating an event', async () => {
    const req = {
      body: {
        eventTypeId: 1,
        datetime: new Date(),
      },
    } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const error = new Error('Database error');
    (pool.query as vi.Mock).mockRejectedValue(error);

    await createEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });

  it('should get an event by ID', async () => {
    const req = {
      params: { id: '1' },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const event = {
      id: 1,
      event_type_id: 1,
      datetime: new Date(),
      event_type: 'Test Event',
    };

    (pool.query as vi.Mock).mockResolvedValue({ rows: [event] });

    await getEventById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(event);
  });

  it('should return 404 if event by ID is not found', async () => {
    const req = {
      params: { id: '1' },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    (pool.query as vi.Mock).mockResolvedValue({ rows: [] });

    await getEventById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Event not found' });
  });

  it('should handle errors when getting an event by ID', async () => {
    const req = {
      params: { id: '1' },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const error = new Error('Database error');
    (pool.query as vi.Mock).mockRejectedValue(error);

    await getEventById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });

  it('should get a list of events', async () => {
    const req = {
      query: {
        name: 'Test Event',
        date: '2024-05-01',
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const events = [
      { id: 1, event_type_id: 1, datetime: new Date(), event_type: 'Event 1' },
      { id: 2, event_type_id: 2, datetime: new Date(), event_type: 'Event 2' },
    ];

    (pool.query as vi.Mock).mockResolvedValue({ rows: events });

    await getEvents(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(events);
  });

  it('should handle errors when getting a list of events', async () => {
    const req = {
      query: {
        name: 'Test Event',
        date: '2024-05-01',
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const error = new Error('Database error');
    (pool.query as vi.Mock).mockRejectedValue(error);

    await getEvents(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });

  it('should update an event', async () => {
    const req = {
      params: { id: '1' },
      body: {
        eventTypeId: 1,
        datetime: new Date(),
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const updatedEvent = {
      id: 1,
      event_type_id: 1,
      datetime: new Date(),
      event_type: 'Updated Event',
    };

    (pool.query as vi.Mock).mockResolvedValueOnce({ rows: [{ id: 1 }] });
    (pool.query as vi.Mock).mockResolvedValueOnce({ rows: [updatedEvent] });

    await updateEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedEvent);
  });

  it('should return 404 if event to update is not found', async () => {
    const req = {
      params: { id: '999' },
      body: {
        eventTypeId: 1,
        datetime: new Date(),
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    (pool.query as vi.Mock).mockResolvedValueOnce({ rows: [] });

    await updateEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Event not found' });
  });

  it('should handle errors when updating an event', async () => {
    const req = {
      params: { id: '1' },
      body: {
        eventTypeId: 1,
        datetime: new Date(),
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const error = new Error('Database error');
    (pool.query as vi.Mock).mockRejectedValue(error);

    await updateEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });

  it('should delete an event', async () => {
    const req = {
      params: { id: '1' },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const deletedEvent = {
      id: 1,
      event_type_id: 1,
      datetime: new Date(),
      event_type: 'Deleted Event',
    };

    (pool.query as vi.Mock).mockResolvedValue({ rows: [deletedEvent] });

    await deleteEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(deletedEvent);
  });

  it('should return 404 if event to delete is not found', async () => {
    const req = {
      params: { id: '999' },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    (pool.query as vi.Mock).mockResolvedValue({ rows: [] });

    await deleteEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Event not found' });
  });

  it('should handle errors when deleting an event', async () => {
    const req = {
      params: { id: '1' },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const error = new Error('Database error');
    (pool.query as vi.Mock).mockRejectedValue(error);

    await deleteEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });
});
