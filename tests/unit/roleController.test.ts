import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { Request, Response } from "express";
import {
  createRole,
  getRoleById,
  getRoles,
  updateRole,
  deleteRole,
} from "../../src/controllers/roleController";
import * as roleService from "../../src/services/roleService";

vi.mock("../../src/services/roleService");

describe("Role Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create an role", async () => {
    const mockRole = {
      id: 1,
      name: "Test Role",
    };

    const req = {
      body: {
        name: mockRole.name,
      },
    } as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    (roleService.create as Mock).mockResolvedValue(mockRole);

    await createRole(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockRole);
  });

  it("should handle errors when creating an role", async () => {
    const req = {
      body: {
        name: "Test Role",
      },
    } as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const error = new Error("Database error");
    (roleService.create as Mock).mockRejectedValue(error);

    await createRole(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });

  it("should get an role by ID", async () => {
    const req = {
      params: { id: "1" },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const role = {
      id: 1,
      name: "Test Role",
    };

    (roleService.getById as Mock).mockResolvedValue(role);

    await getRoleById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(role);
  });

  it("should return 404 if role by ID is not found", async () => {
    const req = {
      params: { id: "1" },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    (roleService.getById as Mock).mockResolvedValue(null);

    await getRoleById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Role not found" });
  });

  it("should handle errors when getting an role by ID", async () => {
    const req = {
      params: { id: "1" },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const error = new Error("Database error");
    (roleService.getById as Mock).mockRejectedValue(error);

    await getRoleById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });

  it("should get a list of roles", async () => {
    const req = {
      query: {
        name: "Role",
      },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const roles = [
      { id: 1, name: "Role 1" },
      { id: 2, name: "Role 2" },
    ];

    (roleService.getMany as Mock).mockResolvedValue(roles);

    await getRoles(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(roles);
  });

  it("should handle errors when getting a list of roles", async () => {
    const req = {
      query: {
        name: "Test Role",
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const error = new Error("Database error");
    (roleService.getMany as Mock).mockRejectedValue(error);

    await getRoles(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });

  it("should update an role", async () => {
    const req = {
      params: { id: "1" },
      body: {
        name: "Updated Role",
      },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const updatedRole = {
      id: 1,
      name: "Updated Role",
    };

    (roleService.getById as Mock).mockResolvedValueOnce({ id: "1" });
    (roleService.update as Mock).mockResolvedValueOnce(updatedRole);

    await updateRole(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedRole);
  });

  it("should return 404 if role to update is not found", async () => {
    const req = {
      params: { id: "999" },
      body: {
        name: "Updated Role",
      },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    (roleService.getById as Mock).mockResolvedValueOnce(null);

    await updateRole(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Role not found" });
  });

  it("should handle errors when updating an role", async () => {
    const req = {
      params: { id: "1" },
      body: {
        name: "Updated Role",
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const error = new Error("Database error");
    (roleService.update as Mock).mockRejectedValue(error);

    await updateRole(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });

  it("should delete an role", async () => {
    const req = {
      params: { id: "1" },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const deletedRole = {
      id: 1,
      name: "Deleted Role",
    };

    (roleService.getById as Mock).mockResolvedValueOnce({ id: 1 });
    (roleService.remove as Mock).mockResolvedValue(deletedRole);

    await deleteRole(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(deletedRole);
  });

  it("should return 404 if role to delete is not found", async () => {
    const req = {
      params: { id: "999" },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    (roleService.getById as Mock).mockResolvedValueOnce(null);

    await deleteRole(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Role not found" });
  });

  it("should handle errors when deleting an role", async () => {
    const req = {
      params: { id: "1" },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const error = new Error("Database error");
    (roleService.remove as Mock).mockRejectedValue(error);

    await deleteRole(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });
});
