import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { timeAgo } from '../utils/timeAgo';

const TEXT = {
    like: 'liked your photo.',
    comment: 'commented your photo.',
    follow: 'started following you.',
};


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