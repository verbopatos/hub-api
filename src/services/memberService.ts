//memberService.ts
import prisma from "../prisma";
import { Member } from "../models/member";

export const create = (member: Member) => {
  return prisma.member.create({
    data: {
      email: member.email,
      password: member.password,
      name: member.name,
      cpf: member.cpf,
      street: member.street,
      neighborhood: member.neighborhood,
      city: member.city,
      state: member.state,
      zipCode: member.zipCode,
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
