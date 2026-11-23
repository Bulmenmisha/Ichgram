import { useEffect, useState } from 'react';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import PostModal from '../components/PostModal';

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
        <div>
            {posts.map((post) => (
                <PostCard key={post._id} post={post} onOpen={(p) => setOpenPostId(p._id)} />
            ))} 
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