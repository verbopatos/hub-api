//memberService.ts
import prisma from '../prisma';
import { Member } from '../models/member';

export const create = (member: Member) => {
  return prisma.members.create({ data: member });
};

export const getById = (id: number) => {
  return prisma.members.findUnique({ where: { id } });
};

export const getByEmail = (email: string) => {
  return prisma.members.findUnique({ where: { email } });
};

export const update = (id: number, member: Member) => {
  return prisma.members.update({ where: { id }, data: member });
};

export const remove = (id: number) => {
  return prisma.members.delete({ where: { id } });
};
