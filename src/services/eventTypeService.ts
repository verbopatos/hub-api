//eventTypeService.ts
import prisma from "../prisma";
import { EventType } from "../models/eventType";

export const create = (eventType: EventType) => {
  return prisma.eventType.create({ data: eventType });
};

export const getById = (id: number) => {
  return prisma.eventType.findUnique({ where: { id } });
};

export const getMany = (filteredConditions: any[]) => {
  return prisma.eventType.findMany({
    where: filteredConditions.length > 0 ? { AND: filteredConditions } : {},
  });
};

export const update = (id: number, eventType: EventType) => {
  return prisma.eventType.update({ where: { id }, data: eventType });
};

export const remove = (id: number) => {
  return prisma.eventType.delete({ where: { id } });
};
// Path: src/services/eventService.ts
