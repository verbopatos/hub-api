// src/services/roleService.ts
import prisma from "../prisma";
import { Role } from "../models/role";

export const create = (role: Role) => {
  return prisma.role.create({
    data: {
      name: role.name,
    },
  });
};

export const getById = (id: number) => {
  return prisma.role.findUnique({
    where: { id },
  });
};

export const getMany = (filteredConditions: any) => {
  return prisma.role.findMany({
    where: {
      AND: filteredConditions,
    },
  });
};

export const update = (id: number, role: Role) => {
  return prisma.role.update({
    where: { id },
    data: {
      name: role.name,
    },
  });
};

export const remove = (id: number) => {
  return prisma.role.delete({ where: { id } });
};
