//eventService.test.ts
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import * as eventService from '../../src/services/eventService';
import prisma from '../../src/prisma';

vi.mock('../../src/prisma', () => {
  return {
    default: {
      events: {
        create: vi.fn(),
        findUnique: vi.fn(),
        findMany: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    },
  };
});

describe('Event Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should create an event', async () => {
    const mockEvent = { id: 1, eventTypeId: 1, datetime: new Date() };

    (prisma.events.create as Mock).mockResolvedValue(mockEvent);

    const result = await eventService.create(mockEvent);

    expect(result).toEqual(mockEvent);
    expect(prisma.events.create).toHaveBeenCalledWith({ data: mockEvent });
  });

  it('should get an event by ID', async () => {
    const mockEvent = { id: 1, eventTypeId: 1, datetime: new Date() };

    (prisma.events.findUnique as Mock).mockResolvedValue(mockEvent);

    const result = await eventService.getById(1);

    expect(result).toEqual(mockEvent);
    expect(prisma.events.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should return null if event by ID is not found', async () => {
    (prisma.events.findUnique as Mock).mockResolvedValue(null);

    const result = await eventService.getById(999);

    expect(result).toBeNull();
    expect(prisma.events.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
  });

  it('should get a list of events without conditions', async () => {
    const mockEvents = [
      { id: 1, eventTypeId: 1, datetime: new Date() },
      { id: 2, eventTypeId: 2, datetime: new Date() },
    ];

    (prisma.events.findMany as Mock).mockResolvedValue(mockEvents);

    const result = await eventService.getMany([]);

    expect(result).toEqual(mockEvents);
    expect(prisma.events.findMany).toHaveBeenCalledWith({
      where: {},
      include: { event_types: true },
    });
  });

  it('should get a list of events with conditions', async () => {
    const mockEvents = [{ id: 1, eventTypeId: 1, datetime: new Date() }];
    const conditions = [{ eventTypeId: 1 }];

    (prisma.events.findMany as Mock).mockResolvedValue(mockEvents);

    const result = await eventService.getMany(conditions);

    expect(result).toEqual(mockEvents);
    expect(prisma.events.findMany).toHaveBeenCalledWith({
      where: { AND: conditions },
      include: { event_types: true },
    });
  });

  it('should update an event', async () => {
    const mockEvent = { id: 1, eventTypeId: 1, datetime: new Date() };

    (prisma.events.update as Mock).mockResolvedValue(mockEvent);

    const result = await eventService.update(1, mockEvent);

    expect(result).toEqual(mockEvent);
    expect(prisma.events.update).toHaveBeenCalledWith({ where: { id: 1 }, data: mockEvent });
  });

  it('should delete an event', async () => {
    const mockEvent = { id: 1, eventTypeId: 1, datetime: new Date() };

    (prisma.events.delete as Mock).mockResolvedValue(mockEvent);

    const result = await eventService.remove(1);
    expect(result).toEqual(mockEvent);
    expect(prisma.events.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
