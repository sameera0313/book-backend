import express from 'express';
import { getAllBooks, addToWishlist, getWishlist, createBook } from '../controllers/book.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getAllBooks);
router.get('/wishlist', authenticateToken, getWishlist);
router.post('/wishlist', authenticateToken, addToWishlist);
router.post('/create-book', authenticateToken, createBook);

export default router;