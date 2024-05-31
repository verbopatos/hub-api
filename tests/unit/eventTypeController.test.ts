import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { Request, Response } from 'express';
import {
  createEventType,
  getEventTypeById,
  getEventTypes,
  updateEventType,
  deleteEventType,
} from '../../src/controllers/eventTypeController';
import * as eventTypeService from '../../src/services/eventTypeService';

vi.mock('../../src/services/eventTypeService');

describe('Event Type Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create an event type', async () => {
    const mockEventType = {
      id: 1,
      name: 'Test Event Type',
    };

    const req = {
      body: {
        name: mockEventType.name,
      },
    } as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    (eventTypeService.create as Mock).mockResolvedValue(mockEventType);

    await createEventType(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockEventType);
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
    (eventTypeService.create as Mock).mockRejectedValue(error);

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

    (eventTypeService.getById as Mock).mockResolvedValue(eventType);

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

    (eventTypeService.getById as Mock).mockResolvedValue(null);

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
    (eventTypeService.getById as Mock).mockRejectedValue(error);

    await getEventTypeById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });

  it('should get a list of event types', async () => {
    const req = {
      query: {
        name: 'Event',
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

    (eventTypeService.getMany as Mock).mockResolvedValue(eventTypes);

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
    (eventTypeService.getMany as Mock).mockRejectedValue(error);

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

    (eventTypeService.getById as Mock).mockResolvedValueOnce({ id: '1' });
    (eventTypeService.update as Mock).mockResolvedValueOnce(updatedEventType);

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

    (eventTypeService.getById as Mock).mockResolvedValueOnce(null);

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
    (eventTypeService.update as Mock).mockRejectedValue(error);

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

    (eventTypeService.getById as Mock).mockResolvedValueOnce({ id: 1 });
    (eventTypeService.remove as Mock).mockResolvedValue(deletedEventType);

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

    (eventTypeService.getById as Mock).mockResolvedValueOnce(null);

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
    (eventTypeService.remove as Mock).mockRejectedValue(error);

    await deleteEventType(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });
});
