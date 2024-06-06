//eventService.ts
import prisma from "../prisma";
import { Event } from "../models/event";

export const create = (event: Event) => {
  return prisma.event.create({
    data: {
      datetime: event.datetime,
      eventType: {
        connect: { id: event.eventTypeId },
      },
    },
  });
};

export const getById = (id: number) => {
  return prisma.event.findUnique({
    where: { id },
    include: { eventType: true },
  });
};

export const getMany = (filteredConditions: any[]) => {
  return prisma.event.findMany({
    where: filteredConditions.length > 0 ? { AND: filteredConditions } : {},
    include: {
      eventType: true, // Include related event type
    },
  });
};

export const update = (id: number, event: Event) => {
  return prisma.event.update({
    where: { id },
    data: {
      datetime: event.datetime,
      eventType: {
        connect: { id: event.eventTypeId },
      },
    },
  });
};

export const remove = (id: number) => {
  return prisma.event.delete({ where: { id } });
};

// Path: src/services/eventService.ts
