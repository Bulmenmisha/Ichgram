import { Router } from 'express';
import { addComment, getPostComments, deleteComment } from '../controllers/commentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/:postId', protect, addComment);
router.get('/:postId', protect, getPostComments);
router.delete('/:commentId', protect, deleteComment);

export default router; 