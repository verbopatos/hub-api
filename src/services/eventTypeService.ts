import prisma from '../prisma';
import { EventType } from '../models/eventType';

export const create = (eventType: EventType) => {
  return prisma.event_types.create({ data: eventType });
};

export const getById = (id: number) => {
  return prisma.event_types.findUnique({ where: { id } });
};

export const getMany = (filteredConditions: any[]) => {
  return prisma.event_types.findMany({
    where: filteredConditions.length > 0 ? { AND: filteredConditions } : {},
  });
};

export const update = (id: number, eventType: EventType) => {
  return prisma.event_types.update({ where: { id }, data: eventType });
};

export const remove = (id: number) => {
  return prisma.event_types.delete({ where: { id } });
};
