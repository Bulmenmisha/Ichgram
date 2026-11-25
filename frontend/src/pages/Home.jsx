import { useEffect, useState } from 'react';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import PostModal from '../components/PostModal';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import './Home.css';

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openPostId, setOpenPostId] = useState(null);

    useEffect(() => {
        api.get('/posts/feed')
            .then((res) => setPosts(res.data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p style={{ textAlign: 'center' }}>Loading...</p>;

    if (posts.length === 0) {
        return <p style={{ textAlign: 'center', color: '#737373' }}>No posts yet. Follow someone or create your first post!</p>;
    }

    return (
        <div className="home">
            <div className="home-grid">
            {posts.map((post) => (
                <PostCard key={post._id} post={post} onOpen={(p) => setOpenPostId(p._id)} />
            ))} 
        </div>
            <div className="home-end">
                <IoCheckmarkCircleOutline />
                <p>You've seen all the updates</p>
                <span>You have viewed all new publications</span>
            </div>
                        {openPostId && (
                <PostModal
                    postId={openPostId}
                    onClose={() => setOpenPostId(null)}
                    onDeleted={(id) => setPosts(posts.filter((p) => p._id !== id))}
                    onChange={(changes) => setPosts(posts.map((p) => (p._id === changes._id ? { ...p, ...changes } : p)))}
                />
            )}
        </div>
    );
} 