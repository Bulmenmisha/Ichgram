import { useState } from 'react';
import { IoImagesOutline } from 'react-icons/io5';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './CreatePost.css';

export default function CreatePost({ onClose, onCreated }) {
    const { user } = useAuth();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [caption, setCaption] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    const handleFile = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;
        setFile(selected);
        setPreview(URL.createObjectURL(selected));
    };

    const handleShare = async () => {
        setError('');
        setSaving(true);
        try {
            const data = new FormData();
            data.append('image', file);
            data.append('caption', caption);
            await api.post('/posts', data);
            onCreated();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create post');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="create-post" onClick={(e) => e.stopPropagation()}>
                <header className="create-post-header">
                    <span />
                    <h3>Create new post</h3>
                    <button onClick={handleShare} disabled={!file || saving}>
                        {saving ? 'Sharing...' : 'Share'}
                    </button>
                </header>

                <div className="create-post-body">
                    <div className="create-post-image">
                        {preview ? (
                            <img src={preview} alt="" />
                        ) : (
                            <label className="create-post-upload">
                                <IoImagesOutline />
                                <span>Select a photo from your computer</span>
                                <input type="file" accept="image/*" onChange={handleFile} hidden />
                            </label>
                        )}
                    </div>

                    <div className="create-post-side">
                        <div className="create-post-author">
                            <img src={user.profileImage || '/avatar.svg'} alt="" />
                            <b>{user.username}</b>
                        </div>
                        <textarea
                            placeholder="Write a caption..."
                            maxLength="2200"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                        />
                        <span className="create-post-count">{caption.length}/2200</span>
                        {error && <p className="auth-error">{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
} 