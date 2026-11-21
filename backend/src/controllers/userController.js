import User from '../models/userModel.js';
import Post from '../models/postModel.js';
import Follow from '../models/followModel.js';

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const [postsCount, followersCount, followingCount, isFollowing] = await Promise.all([
            Post.countDocuments({ author: user._id }),
            Follow.countDocuments({ following: user._id }),
            Follow.countDocuments({ follower: user._id }),
            Follow.exists({ follower: req.userId, following: user._id }),
        ]);

        res.json({
            ...user.toObject(),
            postsCount,
            followersCount,
            followingCount,
            isFollowing: Boolean(isFollowing),
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
}; 


export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { username, fullName, bio } = req.body;

        if (username && username !== user.username) {
            const taken = await User.findOne({ username });
            if (taken) {
                return res.status(409).json({ message: 'Username already taken' });
            }
            user.username = username;
        }

        if (fullName) user.fullName = fullName;
        if (bio !== undefined) user.bio = bio;

        if (req.file) {
            const base64 = req.file.buffer.toString('base64');
            user.profileImage = `data:${req.file.mimetype};base64,${base64}`;
        }

        await user.save();

        const { password, ...userData } = user.toObject();
        res.json(userData);
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};