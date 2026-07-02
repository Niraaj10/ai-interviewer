import { Router } from "express";
import { studyRoadmap, suggestQuestions } from "../controller/prep.ctrl";
import multer from "multer";

const router = Router();

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 1024 * 1024 * 5 } // 5MB limit
});


// POST /api/v1/suggest-questions
router.post("/suggest-questions", upload.single("resume"), suggestQuestions);

// POST /api/v1/study-roadmap
router.post("/study-roadmap", upload.single("resume"), studyRoadmap);

export default router;