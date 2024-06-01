//eventService.ts
import prisma from '../prisma';
import { Event } from '../models/event';

export const create = (event: Event) => {
  return prisma.events.create({
    data: {
      datetime: event.datetime,
      event_types: {
        connect: { id: event.eventTypeId }
      }
    }
  });
};

export const getById = (id: number) => {
  return prisma.events.findUnique({
    where: { id },
    include: { event_types: true },
  });
};

export const getMany = (filteredConditions: any[]) => {
  return prisma.events.findMany({
    where: filteredConditions.length > 0 ? { AND: filteredConditions } : {},
    include: {
      event_types: true, // Include related event type
    },
  });
};

export const update = (id: number, event: Event) => {
  return prisma.events.update({
    where: { id },
    data: {
      datetime: event.datetime,
      event_types: {
        connect: { id: event.eventTypeId }
      }
    }
  });
};

export const remove = (id: number) => {
  return prisma.events.delete({ where: { id } });
};

// Path: src/services/eventService.ts
