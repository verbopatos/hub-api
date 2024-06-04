//memberService.ts
import prisma from '../prisma';
import { Prisma } from '@prisma/client';

export const create = (member: Prisma.membersCreateInput) => {
  return prisma.members.create({ data: member });
};

export const getById = (id: number) => {
  return prisma.members.findUnique({ where: { id } });
};

export const getByEmail = (email: string) => {
  return prisma.members.findUnique({ where: { email } });
};

export const update = (id: number, member: Prisma.membersUpdateInput) => {
  return prisma.members.update({ where: { id }, data: member });
};

export const remove = (id: number) => {
  return prisma.members.delete({ where: { id } });
};
