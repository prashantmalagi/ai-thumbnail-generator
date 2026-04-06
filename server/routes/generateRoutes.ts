import express from "express";
import {
  generateThumbnail,
  getMyGenerations,
  deleteGeneration,
} from "../controllers/GenerationController.js";

const router = express.Router();

// POST /api/generate  — generate & save a new thumbnail
router.post("/", generateThumbnail);

// GET /api/generate/my  — get all thumbnails for the logged-in user
router.get("/my", getMyGenerations);

// DELETE /api/generate/:id  — delete a thumbnail by ID
router.delete("/:id", deleteGeneration);

export default router;