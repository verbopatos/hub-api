//eventTypeService.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as eventTypeService from '../../src/services/eventTypeService';
import prisma from '../../src/prisma';

vi.mock('../../src/prisma', () => {
    return {
        default: {
            event_types: {
                create: vi.fn(),
                findUnique: vi.fn(),
                findMany: vi.fn(),
                update: vi.fn(),
                delete: vi.fn(),
            },
        },
    };
});

describe('EventType Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should create an event type', async () => {
        const mockEventType = { id: 1, name: 'Conference' };
        prisma.event_types.create.mockResolvedValue(mockEventType);

        const result = await eventTypeService.create(mockEventType);
        expect(result).toEqual(mockEventType);
        expect(prisma.event_types.create).toHaveBeenCalledWith({ data: mockEventType });
    });

    it('should get an event type by ID', async () => {
        const mockEventType = { id: 1, name: 'Conference' };
        prisma.event_types.findUnique.mockResolvedValue(mockEventType);

        const result = await eventTypeService.getById(1);
        expect(result).toEqual(mockEventType);
        expect(prisma.event_types.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null if event type by ID is not found', async () => {
        prisma.event_types.findUnique.mockResolvedValue(null);

        const result = await eventTypeService.getById(999);
        expect(result).toBeNull();
        expect(prisma.event_types.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
    });

    it('should get a list of event types without conditions', async () => {
        const mockEventTypes = [
            { id: 1, name: 'Conference' },
            { id: 2, name: 'Workshop' },
        ];
        prisma.event_types.findMany.mockResolvedValue(mockEventTypes);

        const result = await eventTypeService.getMany([]);
        expect(result).toEqual(mockEventTypes);
        expect(prisma.event_types.findMany).toHaveBeenCalledWith({
            where: {},
        });
    });

    it('should get a list of event types with conditions', async () => {
        const mockEventTypes = [{ id: 1, name: 'Conference' }];
        const conditions = [{ name: 'Conference' }];
        prisma.event_types.findMany.mockResolvedValue(mockEventTypes);

        const result = await eventTypeService.getMany(conditions);
        expect(result).toEqual(mockEventTypes);
        expect(prisma.event_types.findMany).toHaveBeenCalledWith({
            where: { AND: conditions },
        });
    });

    it('should update an event type', async () => {
        const mockEventType = { id: 1, name: 'Conference' };
        prisma.event_types.update.mockResolvedValue(mockEventType);

        const result = await eventTypeService.update(1, mockEventType);
        expect(result).toEqual(mockEventType);
        expect(prisma.event_types.update).toHaveBeenCalledWith({ where: { id: 1 }, data: mockEventType });
    });

    it('should delete an event type', async () => {
        const mockEventType = { id: 1, name: 'Conference' };
        prisma.event_types.delete.mockResolvedValue(mockEventType);

        const result = await eventTypeService.remove(1);
        expect(result).toEqual(mockEventType);
        expect(prisma.event_types.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
});
