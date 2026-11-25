import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './EditProfile.css';

export default function EditProfile() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: user.username,
        website: user.website || '',
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
            data.append('website', form.website);
            data.append('bio', form.bio);
            if (file) data.append('profileImage', file);

            const res = await api.put('/users/profile', data);
            setUser(res.data);
            navigate(`/profile/${res.data._id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form className="edit-page" onSubmit={handleSubmit}>
            <h2>Edit profile</h2>

            <div className="edit-page-card">
                <img src={preview} alt="" />
                <div className="edit-page-card-info">
                    <b>{form.username}</b>
                    <span>{form.bio}</span>
                </div>
                <label className="edit-page-photo">
                    New photo
                    <input type="file" accept="image/*" onChange={handleFile} hidden />
                </label>
            </div>

            <label>
                Username
                <input name="username" value={form.username} onChange={handleChange} />
            </label>
            <label>
                Website
                <input name="website" placeholder="bit.ly/..." value={form.website} onChange={handleChange} />
            </label>
            <label>
                About
                <div className="edit-page-textarea">
                    <textarea name="bio" rows="3" maxLength="150" value={form.bio} onChange={handleChange} />
                    <span>{form.bio.length} / 150</span>
                </div>
            </label>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="edit-page-save" disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
            </button>
        </form>
    );
}