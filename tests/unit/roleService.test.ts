//roleService.test.ts
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import * as roleService from "../../src/services/roleService";
import prisma from "../../src/prisma";

vi.mock("../../src/prisma", () => {
  return {
    default: {
      role: {
        create: vi.fn(),
        findUnique: vi.fn(),
        findMany: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    },
  };
});

describe("Role Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should create a role", async () => {
    const mockRole = { id: 1, name: "Conference" };
    const mockRoleInput = { name: "Conference" };

    (prisma.role.create as Mock).mockResolvedValue(mockRole);

    const result = await roleService.create(mockRoleInput);

    expect(result).toEqual(mockRole);
    expect(prisma.role.create).toHaveBeenCalledWith({
      data: mockRoleInput,
    });
  });

  it("should get an role by ID", async () => {
    const mockRole = { id: 1, name: "Conference" };

    (prisma.role.findUnique as Mock).mockResolvedValue(mockRole);

    const result = await roleService.getById(1);

    expect(result).toEqual(mockRole);
    expect(prisma.role.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it("should return null if role by ID is not found", async () => {
    (prisma.role.findUnique as Mock).mockResolvedValue(null);

    const result = await roleService.getById(999);

    expect(result).toBeNull();
    expect(prisma.role.findUnique).toHaveBeenCalledWith({
      where: { id: 999 },
    });
  });

  it("should get a list of roles without conditions", async () => {
    const mockRoles = [
      { id: 1, name: "Conference" },
      { id: 2, name: "Workshop" },
    ];

    (prisma.role.findMany as Mock).mockResolvedValue(mockRoles);

    const result = await roleService.getMany([]);

    expect(result).toEqual(mockRoles);
    expect(prisma.role.findMany).toHaveBeenCalledWith({
      where: {
        AND: [],
      },
    });
  });

  it("should get a list of roles with conditions", async () => {
    const mockRoles = [{ id: 1, name: "Conference" }];
    const conditions = [{ name: "Conference" }];

    (prisma.role.findMany as Mock).mockResolvedValue(mockRoles);

    const result = await roleService.getMany(conditions);

    expect(result).toEqual(mockRoles);
    expect(prisma.role.findMany).toHaveBeenCalledWith({
      where: { AND: conditions },
    });
  });

  it("should update a role", async () => {
    const mockRole = { id: 1, name: "Conference" };
    const mockRoleInput = { name: "Conference" };

    (prisma.role.update as Mock).mockResolvedValue(mockRole);

    const result = await roleService.update(1, mockRoleInput);

    expect(result).toEqual(mockRole);
    expect(prisma.role.update).toHaveBeenCalledWith({
      data: mockRoleInput,
      where: { id: 1 },
    });
  });

  it("should delete an role", async () => {
    const mockRole = { id: 1, name: "Conference" };

    (prisma.role.delete as Mock).mockResolvedValue(mockRole);

    const result = await roleService.remove(1);

    expect(result).toEqual(mockRole);
    expect(prisma.role.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});
