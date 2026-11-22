import Post from '../models/postModel.js';
import Like from '../models/likeModel.js';
import Comment from '../models/commentModel.js';
import Follow from '../models/followModel.js'; 

export const createPost = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }

        const base64 = req.file.buffer.toString('base64');
        const image = `data:${req.file.mimetype};base64,${base64}`;

        const post = await Post.create({
            author: req.userId,
            image,
            caption: req.body.caption || '',
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error: error.message });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.params.userId })
            .sort({ createdAt: -1 })
            .populate('author', 'username profileImage');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error: error.message });
    }
};

export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username profileImage');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching post', error: error.message });
    }
}; 


export const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.author.toString() !== req.userId) {
            return res.status(403).json({ message: 'You can edit only your own posts' });
        }

        if (req.body.caption !== undefined) post.caption = req.body.caption;

        if (req.file) {
            const base64 = req.file.buffer.toString('base64');
            post.image = `data:${req.file.mimetype};base64,${base64}`;
        }

        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error updating post', error: error.message });
    }
};

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.author.toString() !== req.userId) {
            return res.status(403).json({ message: 'You can delete only your own posts' });
        }

        await Like.deleteMany({ post: post._id });
        await Comment.deleteMany({ post: post._id });
        await post.deleteOne();
        res.json({ message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post', error: error.message });
    }
};  

export const getExplorePosts = async (req, res) => {
    try {
        const posts = await Post.aggregate([{ $sample: { size: 30 } }]);
        await Post.populate(posts, { path: 'author', select: 'username profileImage' });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching explore posts', error: error.message });
    }
}; 


export const getFeed = async (req, res) => {
    try {
        const follows = await Follow.find({ follower: req.userId }).select('following');
        const authorIds = follows.map((f) => f.following);
        authorIds.push(req.userId);

        const posts = await Post.find({ author: { $in: authorIds } })
            .sort({ createdAt: -1 })
            .limit(20)
            .populate('author', 'username profileImage')
            .lean();

        const likes = await Like.find({
            user: req.userId,
            post: { $in: posts.map((p) => p._id) },
        }).select('post');
        const likedIds = new Set(likes.map((l) => l.post.toString()));

        const result = posts.map((p) => ({ ...p, isLiked: likedIds.has(p._id.toString()) }));
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feed', error: error.message });
    }
};
