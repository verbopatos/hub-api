// memberController.ts
import { Request, Response } from "express";
import { Member } from "../models/member";
import { create, getByEmail } from "../services/memberService";
import argon2 from "argon2";
import dotenv from "dotenv";

dotenv.config();

export const createMember = async (req: Request, res: Response) => {
  const { email, password, departmentId, roleId } = req.body as Member;

  try {
    const existingUser = await getByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        error: "Member has already registered with this email address",
      });
    }

    const passwordSalt = process.env.SALT;
    const hashedPassword = await argon2.hash(password, { salt: passwordSalt }); // use salt option for more security

    const result = await create({
      email,
      password: hashedPassword,
      departmentId,
      roleId,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
