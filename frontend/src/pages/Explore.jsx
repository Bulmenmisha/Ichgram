import { useEffect, useState } from 'react';
import api from '../api/axios';
import PostModal from '../components/PostModal';
import './Explore.css';

export default function Explore() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openPostId, setOpenPostId] = useState(null);

    useEffect(() => {
        api.get('/posts/explore')
            .then((res) => setPosts(res.data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p style={{ textAlign: 'center' }}>Loading...</p>;

    return (
        <div className="explore">
            <div className="explore-grid">
                {posts.map((post) => (
                    <img key={post._id} src={post.image} alt="" onClick={() => setOpenPostId(post._id)} />
                ))}
            </div>
            {posts.length === 0 && <p className="profile-empty">Nothing to explore yet</p>}

            {openPostId && (
                <PostModal
                    postId={openPostId}
                    onClose={() => setOpenPostId(null)}
                    onDeleted={(id) => setPosts(posts.filter((p) => p._id !== id))}
                />
            )}
        </div>
    );
}