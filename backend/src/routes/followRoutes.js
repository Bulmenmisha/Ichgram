import { Router } from 'express';
import {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
} from '../controllers/followController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/:userId', protect, followUser);
router.delete('/:userId', protect, unfollowUser);
router.get('/:userId/followers', protect, getFollowers);
router.get('/:userId/following', protect, getFollowing);

export default router; 
