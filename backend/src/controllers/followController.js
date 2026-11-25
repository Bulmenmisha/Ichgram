import Follow from '../models/followModel.js';
import User from '../models/userModel.js';
import { createNotification, removeNotification } from './notificationController.js'; 

export const followUser = async (req, res) => {
    try {
        const targetId = req.params.userId;

        if (targetId === req.userId) {
            return res.status(400).json({ message: 'You cannot follow yourself' });
        }

        const target = await User.findById(targetId);
        if (!target) {
            return res.status(404).json({ message: 'User not found' });
        }

        const existing = await Follow.findOne({ follower: req.userId, following: targetId });
        if (existing) {
            return res.status(409).json({ message: 'Already following' });
        }

        await Follow.create({ follower: req.userId, following: targetId });
        await createNotification({ recipient: targetId, sender: req.userId, type: 'follow' }); 
        res.status(201).json({ message: 'Followed' });
    } catch (error) {
        res.status(500).json({ message: 'Error following user', error: error.message });
    }
};

export const unfollowUser = async (req, res) => {
    try {
        const deleted = await Follow.findOneAndDelete({
            follower: req.userId,
            following: req.params.userId,
        });
        if (!deleted) {
            return res.status(404).json({ message: 'You are not following this user' });
        }
        await removeNotification({ recipient: req.params.userId, sender: req.userId, type: 'follow' });
        res.json({ message: 'Unfollowed' });
    } catch (error) {
        res.status(500).json({ message: 'Error unfollowing user', error: error.message });
    }
};

export const getFollowers = async (req, res) => {
    try {
        const follows = await Follow.find({ following: req.params.userId })
            .populate('follower', 'username fullName profileImage');
        res.json(follows.map((f) => f.follower));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching followers', error: error.message });
    }
};

export const getFollowing = async (req, res) => {
    try {
        const follows = await Follow.find({ follower: req.params.userId })
            .populate('following', 'username fullName profileImage');
        res.json(follows.map((f) => f.following));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching following', error: error.message });
    }
}; 
