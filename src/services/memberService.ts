//memberService.ts
import prisma from "../prisma";
import { Member } from "../models/member";

export const create = (member: Member) => {
  return prisma.member.create({
    data: {
      email: member.email,
      password: member.password,
      department: {
        connect: { id: member.departmentId },
      },
      role: {
        connect: { id: member.roleId },
      },
    },
  });
};

export const getById = (id: number) => {
  return prisma.member.findUnique({ where: { id } });
};

export const getByEmail = (email: string) => {
  return prisma.member.findUnique({ where: { email } });
};

export const update = (id: number, member: Member) => {
  return prisma.member.update({
    where: { id },
    data: {
      email: member.email,
      password: member.password,
      department: {
        connect: { id: member.departmentId },
      },
      role: {
        connect: { id: member.roleId },
      },
    },
  });
};

export const remove = (id: number) => {
  return prisma.member.delete({ where: { id } });
};

// Path: src/services/memverService.ts
