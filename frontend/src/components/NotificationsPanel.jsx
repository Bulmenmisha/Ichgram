import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const TEXT = {
    like: 'liked your photo.',
    comment: 'commented your photo.',
    follow: 'started following you.',
};

function timeAgo(date) {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
    if (seconds < 60) return 'now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
}

export default function NotificationsPanel({ onClose }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/notifications')
            .then((res) => {
                setItems(res.data);
                return api.put('/notifications/read');
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <h2>Notifications</h2>
            {loading && <p className="panel-empty">Loading...</p>}
            {!loading && items.length === 0 && <p className="panel-empty">No notifications yet.</p>}
            <div className="panel-list">
                {items.map((n) => (
                    <div key={n._id} className={`panel-item ${n.read ? '' : 'unread'}`}>
                        <Link to={`/profile/${n.sender._id}`} onClick={onClose}>
                            <img src={n.sender.profileImage || '/avatar.svg'} alt="" />
                        </Link>
                        <p className="panel-text">
                            <b>{n.sender.username}</b> {TEXT[n.type]}{' '}
                            <span>{timeAgo(n.createdAt)}</span>
                        </p>
                        {n.post?.image && <img className="panel-thumb" src={n.post.image} alt="" />}
                    </div>
                ))}
            </div>
        </>
    );
} 