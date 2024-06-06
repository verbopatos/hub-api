// src/services/departmentService.ts
import prisma from "../prisma";
import { Department } from "../models/department";

export const create = (department: Department) => {
  return prisma.department.create({
    data: {
      name: department.name,
    },
  });
};

export const getById = (id: number) => {
  return prisma.department.findUnique({
    where: { id },
  });
};

export const getMany = (filteredConditions: any) => {
  return prisma.department.findMany({
    where: {
      AND: filteredConditions,
    },
  });
};

export const update = (id: number, department: Department) => {
  return prisma.department.update({
    where: { id },
    data: {
      name: department.name,
    },
  });
};

export const remove = (id: number) => {
  return prisma.department.delete({ where: { id } });
};
