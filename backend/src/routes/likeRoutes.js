import { Router } from 'express';
import { toggleLike, getPostLikes } from '../controllers/likeController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/:postId', protect, toggleLike);
router.get('/:postId', protect, getPostLikes);

export default router; 