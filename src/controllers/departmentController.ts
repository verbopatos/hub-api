// src/controllers/departmentController.ts
import { Request, Response } from "express";
import {
  create,
  getById,
  getMany,
  update,
  remove,
} from "../services/departmentService";
import { Department } from "../models/department";

/**
 * @swagger
 * components:
 *   schemas:
 *     Department:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the department
 *         name:
 *           type: string
 *           description: The name of the department
 *     CreateDepartment:
 *       type: object
 *       required: true
 *       properties:
 *         name:
 *           type: string
 *     UpdateDepartment:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   - name: Departments
 *     description: Department management
 */

/**
 * @swagger
 * /departments:
 *   post:
 *     summary: Create a new department
 *     tags: [Departments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDepartment'
 *     responses:
 *       201:
 *         description: Department created successfully
 *       500:
 *         description: Server error
 */
export const createDepartment = async (req: Request, res: Response) => {
  const { name } = req.body as Department;

  try {
    const result = await create({ name });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

/**
 * @swagger
 * /departments/{id}:
 *   get:
 *     summary: Get a department by ID
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Department details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Department'
 *       404:
 *         description: Department not found
 *       500:
 *         description: Server error
 */
export const getDepartmentById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await getById(Number(id));

    if (!result) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

/**
 * @swagger
 * /departments:
 *   get:
 *     summary: Get a list of departments
 *     tags: [Departments]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: false
 *     responses:
 *       200:
 *         description: A list of departments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Department'
 *       500:
 *         description: Server error
 */
export const getDepartments = async (req: Request, res: Response) => {
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
 * /departments/{id}:
 *   put:
 *     summary: Update a department by ID
 *     tags: [Departments]
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
 *             $ref: '#/components/schemas/UpdateDepartment'
 *     responses:
 *       200:
 *         description: Department updated successfully
 *       404:
 *         description: Department not found
 *       500:
 *         description: Server error
 */
export const updateDepartment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body as Department;

  try {
    const existingDepartment = await getById(Number(id));

    if (!existingDepartment) {
      return res.status(404).json({ message: "Department not found" });
    }

    const result = await update(Number(id), { name });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

/**
 * @swagger
 * /departments/{id}:
 *   delete:
 *     summary: Delete a department by ID
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Department deleted successfully
 *       404:
 *         description: Department not found
 *       500:
 *         description: Server error
 */
export const deleteDepartment = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const existingDepartment = await getById(Number(id));

    if (!existingDepartment) {
      return res.status(404).json({ message: "Department not found" });
    }

    const result = await remove(Number(id));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
