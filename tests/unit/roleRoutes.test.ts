import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import request from "supertest";
import express from "express";
import roleRoutes from "../../src/routes/roleRoutes";
import * as roleService from "../../src/services/roleService";

vi.mock("../../src/services/roleService");

const app = express();
app.use(express.json());
app.use("/api", roleRoutes);

describe("Role Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/roles", () => {
    it("should create a new Role", async () => {
      const newrole = { name: "New Role" };

      const createdrole = {
        id: 1,
        ...newrole,
      };

      (roleService.create as Mock).mockResolvedValue(createdrole);

      const res = await request(app)
        .post("/api/roles")
        .send({ ...newrole });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(createdrole);
    });
  });

  describe("GET /api/roles/:id", () => {
    it("should get an Role by ID", async () => {
      const role = { id: 1, name: "Test Role" };

      (roleService.getById as Mock).mockResolvedValue(role);

      const res = await request(app).get("/api/roles/1");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(role);
    });

    it("should return 404 if Role not found", async () => {
      (roleService.getById as Mock).mockResolvedValue(null);

      const res = await request(app).get("/api/roles/999");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Role not found" });
    });
  });

  describe("GET /api/roles", () => {
    it("should get a list of Roles", async () => {
      const roles = [
        { id: 1, name: "Role 1" },
        { id: 2, name: "Role 2" },
      ];
      (roleService.getMany as Mock).mockResolvedValue(roles);

      const res = await request(app).get("/api/roles");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(roles);
    });
  });

  describe("PUT /api/roles/:id", () => {
    it("should update a role", async () => {
      const updatedrole = { id: 1, name: "Updated Role" };

      (roleService.getById as Mock).mockResolvedValue({ id: 1 });
      (roleService.update as Mock).mockResolvedValue(updatedrole);

      const res = await request(app).put("/api/roles/1").send(updatedrole);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(updatedrole);
    });

    it("should return 404 if Role not found", async () => {
      (roleService.getById as Mock).mockResolvedValue(null);

      const res = await request(app)
        .put("/api/roles/999")
        .send({ name: "Non-existing Role" });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Role not found" });
    });
  });

  describe("DELETE /api/roles/:id", () => {
    it("should delete a role", async () => {
      const deletedrole = { id: 1, name: "Deleted Role" };

      (roleService.getById as Mock).mockResolvedValue({ id: 1 });
      (roleService.remove as Mock).mockResolvedValue(deletedrole);

      const res = await request(app).delete("/api/roles/1");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(deletedrole);
    });

    it("should return 404 if Role not found", async () => {
      (roleService.getById as Mock).mockResolvedValue(null);

      const res = await request(app).delete("/api/roles/999");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Role not found" });
    });
  });
});
