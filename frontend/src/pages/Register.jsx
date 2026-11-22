import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
    const [form, setForm] = useState({ email: '', fullName: '', username: '', password: '' });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            await api.post('/auth/register', form);
            const res = await api.post('/auth/login', { login: form.email, password: form.password });
            await login(res.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setSubmitting(false);
        }
    };

    const isFilled = form.email && form.fullName && form.username && form.password;

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-logo">ICHgram</h1>
                <p className="auth-subtitle">Sign up to see photos and videos from your friends.</p>
                <form onSubmit={handleSubmit} className="auth-form">
                    <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
                    <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} />
                    <input name="username" placeholder="Username" value={form.username} onChange={handleChange} />
                    <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
                    <button type="submit" disabled={submitting || !isFilled}>
                        {submitting ? 'Signing up...' : 'Sign up'}
                    </button>
                    {error && <p className="auth-error">{error}</p>}
                </form>
            </div>
            <div className="auth-card auth-switch">
                Have an account? <Link to="/login">Log in</Link>
            </div>
        </div>
    );
} 