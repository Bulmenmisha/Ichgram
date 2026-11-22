import Like from '../models/likeModel.js';
import Post from '../models/postModel.js';
import { createNotification } from './notificationController.js'; 

export const toggleLike = async (req, res) => {
    try {
        const postId = req.params.postId;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const existingLike = await Like.findOne({ user: req.userId, post: postId });

        if (existingLike) {
            await existingLike.deleteOne();
            await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });
            return res.json({ liked: false, likesCount: post.likesCount - 1 });
        }

        await Like.create({ user: req.userId, post: postId });
        await createNotification({ recipient: post.author, sender: req.userId, type: 'like', post: postId }); 
        await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });
        res.json({ liked: true, likesCount: post.likesCount + 1 });
    } catch (error) {
        res.status(500).json({ message: 'Error toggling like', error: error.message });
    }
};

export const getPostLikes = async (req, res) => {
    try {
        const likes = await Like.find({ post: req.params.postId })
            .populate('user', 'username profileImage');
        res.json(likes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching likes', error: error.message });
    }
}; 