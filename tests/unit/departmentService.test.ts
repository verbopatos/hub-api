//departmentService.test.ts
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import * as departmentService from "../../src/services/departmentService";
import prisma from "../../src/prisma";

vi.mock("../../src/prisma", () => {
  return {
    default: {
      department: {
        create: vi.fn(),
        findUnique: vi.fn(),
        findMany: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    },
  };
});

describe("Department Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should create a department", async () => {
    const mockDepartment = { id: 1, name: "Conference" };
    const mockDepartmentInput = { name: "Conference" };

    (prisma.department.create as Mock).mockResolvedValue(mockDepartment);

    const result = await departmentService.create(mockDepartmentInput);

    expect(result).toEqual(mockDepartment);
    expect(prisma.department.create).toHaveBeenCalledWith({
      data: mockDepartmentInput,
    });
  });

  it("should get an department by ID", async () => {
    const mockDepartment = { id: 1, name: "Conference" };

    (prisma.department.findUnique as Mock).mockResolvedValue(mockDepartment);

    const result = await departmentService.getById(1);

    expect(result).toEqual(mockDepartment);
    expect(prisma.department.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it("should return null if department by ID is not found", async () => {
    (prisma.department.findUnique as Mock).mockResolvedValue(null);

    const result = await departmentService.getById(999);

    expect(result).toBeNull();
    expect(prisma.department.findUnique).toHaveBeenCalledWith({
      where: { id: 999 },
    });
  });

  it("should get a list of departments without conditions", async () => {
    const mockDepartments = [
      { id: 1, name: "Conference" },
      { id: 2, name: "Workshop" },
    ];

    (prisma.department.findMany as Mock).mockResolvedValue(mockDepartments);

    const result = await departmentService.getMany([]);

    expect(result).toEqual(mockDepartments);
    expect(prisma.department.findMany).toHaveBeenCalledWith({
      where: {
        AND: [],
      },
    });
  });

  it("should get a list of departments with conditions", async () => {
    const mockDepartments = [{ id: 1, name: "Conference" }];
    const conditions = [{ name: "Conference" }];

    (prisma.department.findMany as Mock).mockResolvedValue(mockDepartments);

    const result = await departmentService.getMany(conditions);

    expect(result).toEqual(mockDepartments);
    expect(prisma.department.findMany).toHaveBeenCalledWith({
      where: { AND: conditions },
    });
  });

  it("should update a department", async () => {
    const mockDepartment = { id: 1, name: "Conference" };
    const mockDepartmentInput = { name: "Conference" };

    (prisma.department.update as Mock).mockResolvedValue(mockDepartment);

    const result = await departmentService.update(1, mockDepartmentInput);

    expect(result).toEqual(mockDepartment);
    expect(prisma.department.update).toHaveBeenCalledWith({
      data: mockDepartmentInput,
      where: { id: 1 },
    });
  });

  it("should delete an department", async () => {
    const mockDepartment = { id: 1, name: "Conference" };

    (prisma.department.delete as Mock).mockResolvedValue(mockDepartment);

    const result = await departmentService.remove(1);

    expect(result).toEqual(mockDepartment);
    expect(prisma.department.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});
