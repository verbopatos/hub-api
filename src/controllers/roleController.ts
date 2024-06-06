// src/controllers/roleController.ts
import { Request, Response } from "express";
import {
  create,
  getById,
  getMany,
  update,
  remove,
} from "../services/roleService";
import { Role } from "../models/role";

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the role
 *         name:
 *           type: string
 *           description: The name of the role
 *     CreateRole:
 *       type: object
 *       required: true
 *       properties:
 *         name:
 *           type: string
 *     UpdateRole:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   - name: Roles
 *     description: Role management
 */

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRole'
 *     responses:
 *       201:
 *         description: Role created successfully
 *       500:
 *         description: Server error
 */
export const createRole = async (req: Request, res: Response) => {
  const { name } = req.body as Role;

  try {
    const result = await create({ name });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

/**
 * @swagger
 * /roles/{id}:
 *   get:
 *     summary: Get a role by ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Role details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: Role not found
 *       500:
 *         description: Server error
 */
export const getRoleById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await getById(Number(id));

    if (!result) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Get a list of roles
 *     tags: [Roles]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: false
 *     responses:
 *       200:
 *         description: A list of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *       500:
 *         description: Server error
 */
export const getRoles = async (req: Request, res: Response) => {
  const { name } = req.query;

  try {
    const filteredConditions = [];
    if (name) {
      filteredConditions.push({
        name: { contains: name as string, mode: "insensitive" },
      });
    }

    const result = await getMany(filteredConditions);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

/**
 * @swagger
 * /roles/{id}:
 *   put:
 *     summary: Update a role by ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRole'
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       404:
 *         description: Role not found
 *       500:
 *         description: Server error
 */
export const updateRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body as Role;

  try {
    const existingRole = await getById(Number(id));

    if (!existingRole) {
      return res.status(404).json({ message: "Role not found" });
    }

    const result = await update(Number(id), { name });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     summary: Delete a role by ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       204:
 *         description: Role deleted successfully
 *       404:
 *         description: Role not found
 *       500:
 *         description: Server error
 */
export const deleteRole = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const existingRole = await getById(Number(id));

    if (!existingRole) {
      return res.status(404).json({ message: "Role not found" });
    }

    await remove(Number(id));

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
