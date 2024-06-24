// memberController.ts
import { Request, Response } from "express";
import { Member } from "../models/member";
import {
  create,
  getByEmail,
  getById,
  getMany,
  update,
} from "../services/memberService";
import argon2 from "argon2";
import dotenv from "dotenv";
import { Prisma } from "@prisma/client";

dotenv.config();

export const createMember = async (req: Request, res: Response) => {
  const {
    email,
    password,
    name,
    cpf,
    street,
    neighborhood,
    city,
    state,
    zipCode,
    departmentId,
    roleId,
  } = req.body as Member;

  try {
    const existingUser = await getByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        error: "Member has already registered with this email address",
      });
    }

    const passwordSalt = process.env.SALT;
    const hashedPassword = await argon2.hash(password, {
      salt: Buffer.from(String(passwordSalt)),
    }); // use salt option for more security

    const result = await create({
      email,
      password: hashedPassword,
      name,
      cpf,
      street,
      neighborhood,
      city,
      state,
      zipCode,
      departmentId,
      roleId,
    });

    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getMembetById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await getById(Number(id));

    if (!result) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const getMembers = async (req: Request, res: Response) => {
  const { name } = req.params;

  const conditions: Prisma.MemberWhereInput[] = [];

  if (name) {
    conditions.push({
      name: {
        contains: name,
        mode: "insensitive",
      },
    });
  }

  const filteredConditions = conditions.filter(Boolean);

  try {
    const result = await getMany(filteredConditions);

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const updateMember = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    email,
    password,
    name,
    cpf,
    street,
    neighborhood,
    city,
    state,
    zipCode,
    departmentId,
    roleId,
  } = req.body as Member;

  try {
    const existingMember = await getById(Number(id));

    if (!existingMember) {
      return res.status(404).json({ message: "Event not found" });
    }

    const result = await update(Number(id), {
      email,
      password,
      name,
      cpf,
      street,
      neighborhood,
      city,
      state,
      zipCode,
      departmentId,
      roleId,
    });

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};
