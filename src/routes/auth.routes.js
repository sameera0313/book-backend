import express from 'express';
import { signup, login, logout , getCurrentUser } from '../controllers/auth.controller.js';
import { validateAuth  , authenticateToken} from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', validateAuth, signup);
router.post('/login', validateAuth, login);
router.post('/logout', logout);
router.get("/get-current-user" , authenticateToken , getCurrentUser);

export default router;