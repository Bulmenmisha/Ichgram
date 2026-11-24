import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoHeartOutline, IoHeart, IoClose, IoEllipsisHorizontal } from 'react-icons/io5';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './PostModal.css';

export default function PostModal({ postId, onClose, onDeleted, onChange }) {
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');
    const [error, setError] = useState('');
    const [notFound, setNotFound] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [captionDraft, setCaptionDraft] = useState('');

    useEffect(() => {
        Promise.all([api.get(`/posts/${postId}`), api.get(`/comments/${postId}`)])
            .then(([postRes, commentsRes]) => {
                setPost(postRes.data);
                setComments(commentsRes.data);
            })
            .catch(() => setNotFound(true));
    }, [postId]);

    const updatePost = (changes) => {
        const updated = { ...post, ...changes };
        setPost(updated);
        onChange?.({
            _id: updated._id,
            isLiked: updated.isLiked,
            likesCount: updated.likesCount,
            commentsCount: updated.commentsCount,
            caption: updated.caption,
        });
    };

    const run = async (action) => {
        setError('');
        try {
            await action();
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    const toggleLike = () => run(async () => {
        const res = await api.post(`/likes/${postId}`);
        updatePost({ isLiked: res.data.liked, likesCount: res.data.likesCount });
    });

    const addComment = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        run(async () => {
            const res = await api.post(`/comments/${postId}`, { text });
            setComments([...comments, res.data]);
            updatePost({ commentsCount: post.commentsCount + 1 });
            setText('');
        });
    };

    const deleteComment = (commentId) => run(async () => {
        await api.delete(`/comments/${commentId}`);
        setComments(comments.filter((c) => c._id !== commentId));
        updatePost({ commentsCount: post.commentsCount - 1 });
    });

    const deletePost = () => run(async () => {
        setMenuOpen(false);
        if (!window.confirm('Delete this post?')) return;
        await api.delete(`/posts/${postId}`);
        onDeleted?.(postId);
        onClose();
    });

    const startEdit = () => {
        setCaptionDraft(post.caption);
        setEditing(true);
        setMenuOpen(false);
    };

    const saveCaption = () => run(async () => {
        const res = await api.put(`/posts/${postId}`, { caption: captionDraft });
        updatePost({ caption: res.data.caption });
        setEditing(false);
    });

    if (notFound) {
        return (
            <div className="modal-overlay" onClick={onClose}>
                <p className="modal-message">Post not found</p>
            </div>
        );
    }

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
                        {isOwner && (
                            <button className="post-modal-more" onClick={() => setMenuOpen(true)}>
                                <IoEllipsisHorizontal />
                            </button>
                        )}
                    </header>

                    <div className="post-modal-comments">
                        {editing ? (
                            <div className="post-modal-edit">
                                <textarea
                                    value={captionDraft}
                                    maxLength="2200"
                                    onChange={(e) => setCaptionDraft(e.target.value)}
                                    autoFocus
                                />
                                <div>
                                    <button onClick={() => setEditing(false)}>Cancel</button>
                                    <button className="primary" onClick={saveCaption}>Save</button>
                                </div>
                            </div>
                        ) : (
                            post.caption && <p><b>{post.author.username}</b> {post.caption}</p>
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

                    {error && <p className="post-modal-error">{error}</p>}

                    <form className="post-modal-form" onSubmit={addComment}>
                        <input placeholder="Add a comment..." value={text} onChange={(e) => setText(e.target.value)} />
                        <button type="submit" disabled={!text.trim()}>Post</button>
                    </form>
                </div>
            </div>

            {menuOpen && (
                <div className="post-menu" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }}>
                    <div className="post-menu-box" onClick={(e) => e.stopPropagation()}>
                        <button className="danger" onClick={deletePost}>Delete</button>
                        <button onClick={startEdit}>Edit</button>
                        <button onClick={() => setMenuOpen(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}