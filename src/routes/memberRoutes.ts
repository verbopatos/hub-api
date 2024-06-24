//memberRoutes.ts
import { Router } from "express";
import { createMember } from "../controllers/memberController";

const router = Router();

router.post("/members", createMember);

// router.get("/members/:id", getMemberById);

// router.put("/members/:id", updateMember);

// router.delete("/members/:id, deleteMember")

export default router;
