import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function SearchPanel({ onClose }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }
        const timer = setTimeout(() => {
            api.get('/search/users', { params: { q: query } })
                .then((res) => setResults(res.data))
                .catch((err) => console.error(err));
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    return (
        <>
            <h2>Search</h2>
            <input
                className="panel-search-input"
                placeholder="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
            />
            <div className="panel-list">
                {results.map((u) => (
                    <Link key={u._id} to={`/profile/${u._id}`} className="panel-item" onClick={onClose}>
                        <img src={u.profileImage || '/avatar.svg'} alt="" />
                        <div>
                            <b>{u.username}</b>
                            <span>{u.fullName}</span>
                        </div>
                    </Link>
                ))}
                {query.trim() && results.length === 0 && <p className="panel-empty">No results found.</p>}
            </div>
        </>
    );
} 