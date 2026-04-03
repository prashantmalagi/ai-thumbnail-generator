import { Router } from 'express';
import { generateThumbnail, getMyGenerations, deleteGeneration } from '../controllers/GenerationController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = Router();

// All generation routes require login
router.post('/', isAuthenticated, generateThumbnail);
router.get('/my', isAuthenticated, getMyGenerations);
router.delete('/:id', isAuthenticated, deleteGeneration);

export default router;
