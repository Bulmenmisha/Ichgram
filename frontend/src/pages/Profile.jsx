import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import PostModal from '../components/PostModal';
import './Profile.css';
import NotFound from './NotFound';
import { Link } from 'react-router-dom';

export default function Profile() {
    const { id } = useParams();
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [openPostId, setOpenPostId] = useState(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        setProfile(null);
        setNotFound(false);
        Promise.all([api.get(`/users/${id}`), api.get(`/posts/user/${id}`)])
            .then(([profileRes, postsRes]) => {
                setProfile(profileRes.data);
                setPosts(postsRes.data);
            })
            .catch(() => setNotFound(true)); 
    }, [id]);

    const toggleFollow = async () => {
        if (profile.isFollowing) {
            await api.delete(`/follow/${id}`);
            setProfile({ ...profile, isFollowing: false, followersCount: profile.followersCount - 1 });
        } else {
            await api.post(`/follow/${id}`);
            setProfile({ ...profile, isFollowing: true, followersCount: profile.followersCount + 1 });
        }
    };

    if (notFound) return <NotFound />;
    if (!profile) return <p style={{ textAlign: 'center' }}>Loading...</p>;

    const isMe = user._id === profile._id;

    return (
        <div className="profile">
            <header className="profile-header">
            <div className="profile-avatar-ring">
                    <img className="profile-avatar" src={profile.profileImage || '/avatar.svg'} alt="" />
                </div>
                <div className="profile-info">
                    <div className="profile-top">
                        <h2>{profile.username}</h2>
                        {isMe ? (
                            <Link to="/accounts/edit" className="btn-secondary">Edit profile</Link>
                        ) : (
                            <>
                                <button
                                    className={profile.isFollowing ? 'btn-secondary' : 'btn-primary'}
                                    onClick={toggleFollow}
                                >
                                    {profile.isFollowing ? 'Unfollow' : 'Follow'}
                                </button>
                                <button className="btn-secondary" disabled title="Coming soon">Message</button>
                            </>
                        )}
                    </div>
                    <div className="profile-stats">
                        <span><b>{profile.postsCount}</b> posts</span>
                        <span><b>{profile.followersCount}</b> followers</span>
                        <span><b>{profile.followingCount}</b> following</span>
                    </div>
                    <p className="profile-name">{profile.fullName}</p>
                    {profile.bio && <p className="profile-bio">{profile.bio}</p>}
                    {profile.website && (
                        <a
                            className="profile-website"
                            href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            🔗 {profile.website}
                        </a>
                    )}
                </div>
            </header>

            <div className="profile-grid">
                {posts.map((post) => (
                    <img key={post._id} src={post.image} alt="" onClick={() => setOpenPostId(post._id)} />
                ))}
            </div>
            {posts.length === 0 && <p className="profile-empty">No posts yet</p>}

            {openPostId && (
                <PostModal
                    postId={openPostId}
                    onClose={() => setOpenPostId(null)}
                    onDeleted={(postId) => {
                        setPosts(posts.filter((p) => p._id !== postId));
                        setProfile({ ...profile, postsCount: profile.postsCount - 1 });
                    }}
                />
            )}

            
        </div>
    );
}