import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
    const [form, setForm] = useState({ login: '', password: '' });
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
            const res = await api.post('/auth/login', form);
            await login(res.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-page auth-page-login">
        <img className="auth-phones" src="/phones.png" alt="" onError={(e) => (e.target.style.display = 'none')} />
        <div className="auth-column">
            <div className="auth-card">
                <h1 className="auth-logo">ICHgram</h1>
                <form onSubmit={handleSubmit} className="auth-form">
                    <input
                        name="login"
                        placeholder="Username, or email"
                        value={form.login}
                        onChange={handleChange}
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                    />
                    <button type="submit" disabled={submitting || !form.login || !form.password}>
                        {submitting ? 'Logging in...' : 'Log in'}
                    </button>
                    {error && <p className="auth-error">{error}</p>}
                    <div className="auth-divider"><span>OR</span></div>
                    <span className="auth-forgot">Forgot password?</span>
                </form>
            </div>
            <div className="auth-card auth-switch">
                Don't have an account? <Link to="/register">Sign up</Link>
            </div>
            </div>
        </div>
    );
}