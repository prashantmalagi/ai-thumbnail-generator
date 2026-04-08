import { Router } from 'express';
import { registerUser, loginUser, logoutUser, getMe } from '../controllers/AuthControllers.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', getMe);

export default router;