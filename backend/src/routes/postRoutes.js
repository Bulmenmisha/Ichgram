import { Router } from 'express';
import {
    createPost,
    getUserPosts,
    getPostById,
    updatePost,
    deletePost,
    getExplorePosts,
    getFeed,  
} from '../controllers/postController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = Router();

router.post('/', protect, upload.single('image'), createPost);
router.get('/feed', protect, getFeed); 
router.get('/explore', protect, getExplorePosts); 
router.get('/user/:userId', protect, getUserPosts);
router.get('/:id', protect, getPostById);
router.put('/:id', protect, upload.single('image'), updatePost);
router.delete('/:id', protect, deletePost);

export default router; 