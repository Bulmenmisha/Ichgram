import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoHeartOutline, IoHeart, IoChatbubbleOutline } from 'react-icons/io5';
import api from '../api/axios';
import './PostCard.css';
import { timeAgo } from '../utils/timeAgo'; 

export default function PostCard({ post, onOpen }) {
    const [liked, setLiked] = useState(post.isLiked);
    const [likesCount, setLikesCount] = useState(post.likesCount);
    useEffect(() => {
        setLiked(post.isLiked);
        setLikesCount(post.likesCount);
    }, [post.isLiked, post.likesCount]);

    const toggleLike = async () => {
        try {
            const res = await api.post(`/likes/${post._id}`);
            setLiked(res.data.liked);
            setLikesCount(res.data.likesCount);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <article className="post-card">
            <header className="post-card-header">
                <Link to={`/profile/${post.author._id}`} className="post-card-author">
                    <img src={post.author.profileImage || '/avatar.svg'} alt="" />
                    <span>{post.author.username}</span>
                </Link>
                <span className="post-card-time">• {timeAgo(post.createdAt)}</span>
            </header>

            <img className="post-card-image" src={post.image} alt="" onDoubleClick={toggleLike} />

            <div className="post-card-actions">
                <button onClick={toggleLike} className={liked ? 'liked' : ''}>
                    {liked ? <IoHeart /> : <IoHeartOutline />}
                </button>
                <button onClick={() => onOpen(post)}>
                    <IoChatbubbleOutline />
                </button>
            </div>

            <div className="post-card-body">
                <p className="post-card-likes">{likesCount} likes</p>
                {post.caption && (
                    <p>
                        <b>{post.author.username}</b> {post.caption}
                    </p>
                )}
                {post.commentsCount > 0 && (
                    <button className="post-card-comments" onClick={() => onOpen(post)}>
                        View all comments ({post.commentsCount})
                    </button>
                )}
            </div>
        </article>
    );
} 