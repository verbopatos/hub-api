import { Prisma } from '@prisma/client';
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
