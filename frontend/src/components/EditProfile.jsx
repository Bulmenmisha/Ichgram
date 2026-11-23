import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './EditProfile.css';

export default function EditProfile({ onClose, onSaved }) {
    const { user, setUser } = useAuth();
    const [form, setForm] = useState({
        username: user.username,
        fullName: user.fullName,
        bio: user.bio || '',
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(user.profileImage || '/avatar.svg');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFile = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;
        setFile(selected);
        setPreview(URL.createObjectURL(selected));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            const data = new FormData();
            data.append('username', form.username);
            data.append('fullName', form.fullName);
            data.append('bio', form.bio);
            if (file) data.append('profileImage', file);

            const res = await api.put('/users/profile', data);
            setUser(res.data);
            onSaved(res.data);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <form className="edit-profile" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
                <h3>Edit profile</h3>

                <div className="edit-profile-avatar">
                    <img src={preview} alt="" />
                    <div>
                        <b>{user.username}</b>
                        <label className="edit-profile-upload">
                            Change photo
                            <input type="file" accept="image/*" onChange={handleFile} hidden />
                        </label>
                    </div>
                </div>

                <label>
                    Username
                    <input name="username" value={form.username} onChange={handleChange} />
                </label>
                <label>
                    Full name
                    <input name="fullName" value={form.fullName} onChange={handleChange} />
                </label>
                <label>
                    About
                    <textarea name="bio" rows="3" maxLength="150" value={form.bio} onChange={handleChange} />
                </label>

                {error && <p className="auth-error">{error}</p>}

                <div className="edit-profile-buttons">
                    <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                    <button type="submit" className="btn-primary" disabled={saving}>
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
} 