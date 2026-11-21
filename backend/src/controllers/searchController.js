import User from '../models/userModel.js';

export const searchUsers = async (req, res) => {
    try {
        const query = (req.query.q || '').trim();
        if (!query) {
            return res.json([]);
        }

        const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escaped, 'i');

        const users = await User.find({
            $or: [{ username: regex }, { fullName: regex }],
        })
            .select('username fullName profileImage')
            .limit(20);

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Search error', error: error.message });
    }
}; 
