import Comment from '../models/commentModel.js';
import Post from '../models/postModel.js';

export const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || !text.trim()) {
            return res.status(400).json({ message: 'Comment text is required' });
        }

        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = await Comment.create({
            user: req.userId,
            post: req.params.postId,
            text,
        });
        await Post.findByIdAndUpdate(req.params.postId, { $inc: { commentsCount: 1 } });

        await comment.populate('user', 'username profileImage');
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment', error: error.message });
    }
};

export const getPostComments = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .sort({ createdAt: 1 })
            .populate('user', 'username profileImage');
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments', error: error.message });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const post = await Post.findById(comment.post);
        const isCommentAuthor = comment.user.toString() === req.userId;
        const isPostAuthor = post && post.author.toString() === req.userId;

        if (!isCommentAuthor && !isPostAuthor) {
            return res.status(403).json({ message: 'Not allowed to delete this comment' });
        }

        await comment.deleteOne();
        await Post.findByIdAndUpdate(comment.post, { $inc: { commentsCount: -1 } });
        res.json({ message: 'Comment deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting comment', error: error.message });
    }
};