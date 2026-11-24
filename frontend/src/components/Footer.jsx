import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer({ onSearch, onNotifications, onCreate }) {
    return (
        <footer className="footer">
            <nav>
                <Link to="/">Home</Link>
                <button onClick={onSearch}>Search</button>
                <Link to="/explore">Explore</Link>
                <span className="footer-disabled">Messages</span>
                <button onClick={onNotifications}>Notifications</button>
                <button onClick={onCreate}>Create</button>
            </nav>
            <p>© 2024 ICHgram</p>
        </footer>
    );
}