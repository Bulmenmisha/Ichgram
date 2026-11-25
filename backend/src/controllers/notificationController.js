import Notification from '../models/notificationModel.js';

export const createNotification = async ({ recipient, sender, type, post }) => {
    if (recipient.toString() === sender.toString()) return;
    await Notification.create({ recipient, sender, type, post });
};
export const removeNotification = async ({ recipient, sender, type, post }) => {
    await Notification.deleteOne({ recipient, sender, type, post });
};

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.userId })
            .sort({ createdAt: -1 })
            .limit(50)
            .populate('sender', 'username profileImage')
            .populate('post', 'image');
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error: error.message });
    }
};

export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.userId, read: false },
            { read: true }
        );
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating notifications', error: error.message });
    }
}; 
