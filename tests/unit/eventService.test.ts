//eventService.test.ts
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import * as eventService from "../../src/services/eventService";
import prisma from "../../src/prisma";

vi.mock("../../src/prisma", () => {
  return {
    default: {
      event: {
        create: vi.fn(),
        findUnique: vi.fn(),
        findMany: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    },
  };
});

describe("Event Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should create an event", async () => {
    const mockEvent = { id: 1, eventTypeId: 1, datetime: new Date() };

    const mockEventInput = {
      data: {
        datetime: mockEvent.datetime,
        eventType: {
          connect: {
            id: mockEvent.id,
          },
        },
      },
    };

    (prisma.event.create as Mock).mockResolvedValue(mockEvent);

    const result = await eventService.create(mockEvent);

    expect(result).toEqual(mockEvent);
    expect(prisma.event.create).toHaveBeenCalledWith(mockEventInput);
  });

  it("should get an event by ID", async () => {
    const mockEvent = { id: 1, eventTypeId: 1, datetime: new Date() };

    (prisma.event.findUnique as Mock).mockResolvedValue(mockEvent);

    const result = await eventService.getById(1);

    expect(result).toEqual(mockEvent);
    expect(prisma.event.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { eventType: true },
    });
  });

  it("should return null if event by ID is not found", async () => {
    (prisma.event.findUnique as Mock).mockResolvedValue(null);

    const result = await eventService.getById(999);

    expect(result).toBeNull();
    expect(prisma.event.findUnique).toHaveBeenCalledWith({
      where: { id: 999 },
      include: { eventType: true },
    });
  });

  it("should get a list of events without conditions", async () => {
    const mockEvents = [
      { id: 1, eventTypeId: 1, datetime: new Date() },
      { id: 2, eventTypeId: 2, datetime: new Date() },
    ];

    (prisma.event.findMany as Mock).mockResolvedValue(mockEvents);

    const result = await eventService.getMany([]);

    expect(result).toEqual(mockEvents);
    expect(prisma.event.findMany).toHaveBeenCalledWith({
      where: {},
      include: { eventType: true },
    });
  });

  it("should get a list of events with conditions", async () => {
    const mockEvents = [{ id: 1, eventTypeId: 1, datetime: new Date() }];
    const conditions = [{ eventTypeId: 1 }];

    (prisma.event.findMany as Mock).mockResolvedValue(mockEvents);

    const result = await eventService.getMany(conditions);

    expect(result).toEqual(mockEvents);
    expect(prisma.event.findMany).toHaveBeenCalledWith({
      where: { AND: conditions },
      include: { eventType: true },
    });
  });

  it("should update an event", async () => {
    const mockEvent = { id: 1, eventTypeId: 1, datetime: new Date() };

    const mockEventInput = {
      data: {
        datetime: mockEvent.datetime,
        eventType: {
          connect: {
            id: mockEvent.id,
          },
        },
      },
      where: {
        id: 1,
      },
    };

    (prisma.event.update as Mock).mockResolvedValue(mockEvent);

    const result = await eventService.update(1, mockEvent);

    expect(result).toEqual(mockEvent);
    expect(prisma.event.update).toHaveBeenCalledWith(mockEventInput);
  });

  it("should delete an event", async () => {
    const mockEvent = { id: 1, eventTypeId: 1, datetime: new Date() };

    (prisma.event.delete as Mock).mockResolvedValue(mockEvent);

    const result = await eventService.remove(1);
    expect(result).toEqual(mockEvent);
    expect(prisma.event.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
