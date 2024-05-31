import prisma from '../prisma';
import { Event } from '../models/event';

export const create = (event: Event) => {
  return prisma.events.create({ data: event });
};

export const getById = (id: number) => {
  return prisma.events.findUnique({ where: { id } });
};

export const getMany = (filteredConditions: any[]) => {
  return prisma.events.findMany({
    where: filteredConditions.length > 0 ? { AND: filteredConditions } : {},
    include: {
      event_types: true,
    },
  });
};

export const update = (id: number, event: Event) => {
  return prisma.events.update({ where: { id }, data: event });
};

export const remove = (id: number) => {
  return prisma.events.delete({ where: { id } });
};
