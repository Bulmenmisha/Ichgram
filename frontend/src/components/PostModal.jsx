import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoHeartOutline, IoHeart, IoClose } from 'react-icons/io5';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './PostModal.css';

export default function PostModal({ postId, onClose, onDeleted }) {
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');

    useEffect(() => {
        Promise.all([api.get(`/posts/${postId}`), api.get(`/comments/${postId}`)])
            .then(([postRes, commentsRes]) => {
                setPost(postRes.data);
                setComments(commentsRes.data);
            })
            .catch((err) => console.error(err));
    }, [postId]);

    const toggleLike = async () => {
        const res = await api.post(`/likes/${postId}`);
        setPost({ ...post, isLiked: res.data.liked, likesCount: res.data.likesCount });
    };

    const addComment = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        const res = await api.post(`/comments/${postId}`, { text });
        setComments([...comments, res.data]);
        setText('');
    };

    const deleteComment = async (commentId) => {
        await api.delete(`/comments/${commentId}`);
        setComments(comments.filter((c) => c._id !== commentId));
    };

    const deletePost = async () => {
        if (!window.confirm('Delete this post?')) return;
        await api.delete(`/posts/${postId}`);
        onDeleted?.(postId);
        onClose();
    };

    if (!post) return null;

    const isOwner = post.author._id === user._id;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <button className="modal-close" onClick={onClose}><IoClose /></button>
            <div className="post-modal" onClick={(e) => e.stopPropagation()}>
                <img className="post-modal-image" src={post.image} alt="" />
                <div className="post-modal-side">
                    <header className="post-modal-header">
                        <Link to={`/profile/${post.author._id}`} onClick={onClose} className="post-modal-author">
                            <img src={post.author.profileImage || '/avatar.svg'} alt="" />
                            <b>{post.author.username}</b>
                        </Link>
                        {isOwner && <button className="post-modal-delete" onClick={deletePost}>Delete</button>}
                    </header>

                    <div className="post-modal-comments">
                        {post.caption && (
                            <p><b>{post.author.username}</b> {post.caption}</p>
                        )}
                        {comments.map((c) => (
                            <div key={c._id} className="post-modal-comment">
                                <img src={c.user.profileImage || '/avatar.svg'} alt="" />
                                <p><b>{c.user.username}</b> {c.text}</p>
                                {(c.user._id === user._id || isOwner) && (
                                    <button onClick={() => deleteComment(c._id)}>✕</button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="post-modal-actions">
                        <button onClick={toggleLike} className={post.isLiked ? 'liked' : ''}>
                            {post.isLiked ? <IoHeart /> : <IoHeartOutline />}
                        </button>
                        <b>{post.likesCount} likes</b>
                    </div>

                    <form className="post-modal-form" onSubmit={addComment}>
                        <input placeholder="Add a comment..." value={text} onChange={(e) => setText(e.target.value)} />
                        <button type="submit" disabled={!text.trim()}>Post</button>
                    </form>
                </div>
            </div>
        </div>
    );
} 