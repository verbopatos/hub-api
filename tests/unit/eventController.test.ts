// eventController.test.ts - This file contains tests for the event controller functions.
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { Request, Response } from 'express';
import {
  createEvent,
  getEventById,
  getEvents,
  updateEvent,
  deleteEvent,
} from '../../src/controllers/eventController';
import * as eventService from '../../src/services/eventService';

vi.mock('../../src/services/eventService');

describe('Event Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create an event', async () => {
    const mockEvent = {
      id: 1,
      eventTypeId: 1,
      datetime: new Date(),
    };

    const req = {
      body: {
        eventTypeId: mockEvent.eventTypeId,
        datetime: mockEvent.datetime,
      },
    } as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    (eventService.create as Mock).mockResolvedValue(mockEvent);

    await createEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockEvent);
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
    (eventService.create as Mock).mockRejectedValue(error);

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

    const mockEvent = {
      id: 1,
      event_type_id: 1,
      datetime: new Date(),
      event_type: 'Test Event',
    };

    (eventService.getById as Mock).mockResolvedValue(mockEvent);

    await getEventById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockEvent);
  });

  it('should return 404 if event by ID is not found', async () => {
    const req = {
      params: { id: '1' },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    (eventService.getById as Mock).mockResolvedValue(null);

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
    (eventService.getById as Mock).mockRejectedValue(error);

    await getEventById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });

  it('should get a list of events', async () => {
    const req = {
      query: {
        name: 'Event',
        date: new Date(),
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

    (eventService.getMany as Mock).mockResolvedValue(events);

    await getEvents(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(events);
  });

  it('should handle errors when getting a list of events', async () => {
    const req = {
      query: {
        name: 'Event',
        date: new Date(),
      },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const error = new Error('Database error');
    (eventService.getMany as Mock).mockRejectedValue(error);

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

    (eventService.getById as Mock).mockResolvedValueOnce({ id: 1 });
    (eventService.update as Mock).mockResolvedValueOnce(updatedEvent);

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

    (eventService.getById as Mock).mockResolvedValueOnce(null);

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
    (eventService.update as Mock).mockRejectedValue(error);

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

    (eventService.getById as Mock).mockResolvedValueOnce({ id: 1 });
    (eventService.remove as Mock).mockResolvedValue(deletedEvent);

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

    (eventService.getById as Mock).mockResolvedValueOnce(null);

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
    (eventService.remove as Mock).mockRejectedValue(error);

    await deleteEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });
});
