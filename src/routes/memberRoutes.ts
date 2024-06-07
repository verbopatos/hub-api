//memberRoutes.ts
import { Router } from "express";
import { createMember } from "../controllers/memberController";

const router = Router();

router.post("/members", createMember);

export default router;
