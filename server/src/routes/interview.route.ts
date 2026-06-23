import express from 'express';
import multer from 'multer';
import { preInterview } from '../controller/interview.ctrl';

const router = express.Router();

// In-memory storage so don't need to store temp files on disk
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 1024 * 1024 * 5 } // 5MB limit
});

router.post('/', upload.single('resume'), preInterview);

export default router;