import { Router } from 'express';
import { getUserProfile, updateProfile } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';
import { validateId } from '../middlewares/validateId.js';

const router = Router();

router.param('id', validateId);
router.put('/profile', protect, upload.single('profileImage'), updateProfile);
router.get('/:id', protect, getUserProfile);

export default router; 