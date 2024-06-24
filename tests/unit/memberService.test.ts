//memberService.test.ts
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import * as memberService from "../../src/services/memberService";
import prisma from "../../src/prisma";

vi.mock("../../src/prisma", () => {
  return {
    default: {
      member: {
        create: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    },
  };
});

describe("Member Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should create a member", async () => {
    const mockMember = {
      id: 1,
      email: "email@example.com",
      password: "testpassword",
      departmentId: 1,
      roleId: 1,
    };

    const mockMemberInput = {
      data: {
        email: mockMember.email,
        password: mockMember.password,
        department: {
          connect: { id: mockMember.departmentId },
        },
        role: {
          connect: { id: mockMember.roleId },
        },
      },
    };

    (prisma.member.create as Mock).mockResolvedValue(mockMember);

    const result = await memberService.create(mockMember);

    expect(result).toEqual(mockMember);
    expect(prisma.member.create).toHaveBeenCalledWith(mockMemberInput);
  });

  it("should get a member by ID", async () => {
    const mockMember = {
      id: 1,
      email: "email@example.com",
      password: "testpassword",
    };

    (prisma.member.findUnique as Mock).mockResolvedValue(mockMember);

    const result = await memberService.getById(1);

    expect(result).toEqual(mockMember);
    expect(prisma.member.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it("should return null if member is not found by ID", async () => {
    (prisma.member.findUnique as Mock).mockResolvedValue(null);

    const result = await memberService.getById(999);

    expect(result).toBeNull();
    expect(prisma.member.findUnique).toHaveBeenCalledWith({
      where: { id: 999 },
    });
  });

  it("should get a member by email", async () => {
    const mockMember = {
      id: 1,
      email: "email@example.com",
      password: "testpassword",
    };

    (prisma.member.findUnique as Mock).mockResolvedValue(mockMember);

    const result = await memberService.getByEmail("email@example.com");

    expect(result).toEqual(mockMember);
    expect(prisma.member.findUnique).toHaveBeenCalledWith({
      where: { email: "email@example.com" },
    });
  });

  it("should return null if member is not found by email", async () => {
    (prisma.member.findUnique as Mock).mockResolvedValue(null);

    const result = await memberService.getByEmail("email@example.com");

    expect(result).toBeNull();
    expect(prisma.member.findUnique).toHaveBeenCalledWith({
      where: { email: "email@example.com" },
    });
  });

  it("should update a member", async () => {
    const mockMember = {
      id: 1,
      email: "email@example.com",
      password: "testpassword",
      departmentId: 1,
      roleId: 1,
    };

    const mockMemberInput = {
      data: {
        email: mockMember.email,
        password: mockMember.password,
        department: {
          connect: { id: mockMember.departmentId },
        },
        role: {
          connect: { id: mockMember.roleId },
        },
      },
      where: {
        id: 1,
      },
    };

    (prisma.member.update as Mock).mockResolvedValue(mockMember);

    const result = await memberService.update(1, mockMember);

    expect(result).toEqual(mockMember);
    expect(prisma.member.update).toHaveBeenCalledWith(mockMemberInput);
  });

  it("should delete a member", async () => {
    const mockMember = { id: 1, email: "email@example.com", password: "" };

    (prisma.member.delete as Mock).mockResolvedValue(mockMember);

    const result = await memberService.remove(1);

    expect(result).toEqual(mockMember);
    expect(prisma.member.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
