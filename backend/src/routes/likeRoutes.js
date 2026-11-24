import { Router } from 'express';
import { toggleLike, getPostLikes } from '../controllers/likeController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validateId } from '../middlewares/validateId.js';

const router = Router();

router.param('postId', validateId);
router.post('/:postId', protect, toggleLike);
router.get('/:postId', protect, getPostLikes);

export default router; 