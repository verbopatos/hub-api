import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { Request, Response } from "express";
import {
  createDepartment,
  getDepartmentById,
  getDepartments,
  updateDepartment,
  deleteDepartment,
} from "../../src/controllers/departmentController";
import * as departmentService from "../../src/services/departmentService";

vi.mock("../../src/services/departmentService");

describe("Department Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create an department", async () => {
    const mockDepartment = {
      id: 1,
      name: "Test Department",
    };

    const req = {
      body: {
        name: mockDepartment.name,
      },
    } as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    (departmentService.create as Mock).mockResolvedValue(mockDepartment);

    await createDepartment(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockDepartment);
  });

  it("should handle errors when creating an department", async () => {
    const req = {
      body: {
        name: "Test Department",
      },
    } as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const error = new Error("Database error");
    (departmentService.create as Mock).mockRejectedValue(error);

    await createDepartment(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });

  it("should get an department by ID", async () => {
    const req = {
      params: { id: "1" },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const department = {
      id: 1,
      name: "Test Department",
    };

    (departmentService.getById as Mock).mockResolvedValue(department);

    await getDepartmentById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(department);
  });

  it("should return 404 if department by ID is not found", async () => {
    const req = {
      params: { id: "1" },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    (departmentService.getById as Mock).mockResolvedValue(null);

    await getDepartmentById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Department not found" });
  });

  it("should handle errors when getting an department by ID", async () => {
    const req = {
      params: { id: "1" },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const error = new Error("Database error");
    (departmentService.getById as Mock).mockRejectedValue(error);

    await getDepartmentById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });

  it("should get a list of departments", async () => {
    const req = {
      query: {
        name: "Department",
      },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const departments = [
      { id: 1, name: "Department 1" },
      { id: 2, name: "Department 2" },
    ];

    (departmentService.getMany as Mock).mockResolvedValue(departments);

    await getDepartments(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(departments);
  });

  it("should handle errors when getting a list of departments", async () => {
    const req = {
      query: {
        name: "Test Department",
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const error = new Error("Database error");
    (departmentService.getMany as Mock).mockRejectedValue(error);

    await getDepartments(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });

  it("should update an department", async () => {
    const req = {
      params: { id: "1" },
      body: {
        name: "Updated Department",
      },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const updatedDepartment = {
      id: 1,
      name: "Updated Department",
    };

    (departmentService.getById as Mock).mockResolvedValueOnce({ id: "1" });
    (departmentService.update as Mock).mockResolvedValueOnce(updatedDepartment);

    await updateDepartment(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedDepartment);
  });

  it("should return 404 if department to update is not found", async () => {
    const req = {
      params: { id: "999" },
      body: {
        name: "Updated Department",
      },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    (departmentService.getById as Mock).mockResolvedValueOnce(null);

    await updateDepartment(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Department not found" });
  });

  it("should handle errors when updating an department", async () => {
    const req = {
      params: { id: "1" },
      body: {
        name: "Updated Department",
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const error = new Error("Database error");
    (departmentService.update as Mock).mockRejectedValue(error);

    await updateDepartment(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });

  it("should delete an department", async () => {
    const req = {
      params: { id: "1" },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const deletedDepartment = {
      id: 1,
      name: "Deleted Department",
    };

    (departmentService.getById as Mock).mockResolvedValueOnce({ id: 1 });
    (departmentService.remove as Mock).mockResolvedValue(deletedDepartment);

    await deleteDepartment(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(deletedDepartment);
  });

  it("should return 404 if department to delete is not found", async () => {
    const req = {
      params: { id: "999" },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    (departmentService.getById as Mock).mockResolvedValueOnce(null);

    await deleteDepartment(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Department not found" });
  });

  it("should handle errors when deleting an department", async () => {
    const req = {
      params: { id: "1" },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const error = new Error("Database error");
    (departmentService.remove as Mock).mockRejectedValue(error);

    await deleteDepartment(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });
});
