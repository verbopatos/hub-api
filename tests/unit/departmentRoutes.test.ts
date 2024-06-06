import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import request from "supertest";
import express from "express";
import departmentRoutes from "../../src/routes/departmentRoutes";
import * as departmentService from "../../src/services/departmentService";

vi.mock("../../src/services/departmentService");

const app = express();
app.use(express.json());
app.use("/api", departmentRoutes);

describe("Department Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/departments", () => {
    it("should create a new Department", async () => {
      const newdepartment = { name: "New Department" };

      const createddepartment = {
        id: 1,
        ...newdepartment,
      };

      (departmentService.create as Mock).mockResolvedValue(createddepartment);

      const res = await request(app)
        .post("/api/departments")
        .send({ ...newdepartment });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(createddepartment);
    });
  });

  describe("GET /api/departments/:id", () => {
    it("should get an Department by ID", async () => {
      const department = { id: 1, name: "Test Department" };

      (departmentService.getById as Mock).mockResolvedValue(department);

      const res = await request(app).get("/api/departments/1");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(department);
    });

    it("should return 404 if Department not found", async () => {
      (departmentService.getById as Mock).mockResolvedValue(null);

      const res = await request(app).get("/api/departments/999");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Department not found" });
    });
  });

  describe("GET /api/departments", () => {
    it("should get a list of Departments", async () => {
      const departments = [
        { id: 1, name: "Department 1" },
        { id: 2, name: "Department 2" },
      ];
      (departmentService.getMany as Mock).mockResolvedValue(departments);

      const res = await request(app).get("/api/departments");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(departments);
    });
  });

  describe("PUT /api/departments/:id", () => {
    it("should update a department", async () => {
      const updateddepartment = { id: 1, name: "Updated Department" };

      (departmentService.getById as Mock).mockResolvedValue({ id: 1 });
      (departmentService.update as Mock).mockResolvedValue(updateddepartment);

      const res = await request(app)
        .put("/api/departments/1")
        .send(updateddepartment);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(updateddepartment);
    });

    it("should return 404 if Department not found", async () => {
      (departmentService.getById as Mock).mockResolvedValue(null);

      const res = await request(app)
        .put("/api/departments/999")
        .send({ name: "Non-existing Department" });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Department not found" });
    });
  });

  describe("DELETE /api/departments/:id", () => {
    it("should delete a department", async () => {
      const deleteddepartment = { id: 1, name: "Deleted Department" };

      (departmentService.getById as Mock).mockResolvedValue({ id: 1 });
      (departmentService.remove as Mock).mockResolvedValue(deleteddepartment);

      const res = await request(app).delete("/api/departments/1");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(deleteddepartment);
    });

    it("should return 404 if Department not found", async () => {
      (departmentService.getById as Mock).mockResolvedValue(null);

      const res = await request(app).delete("/api/departments/999");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Department not found" });
    });
  });
});
