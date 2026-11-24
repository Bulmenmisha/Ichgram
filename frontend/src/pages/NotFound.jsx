import './NotFound.css';

export default function NotFound() {
    return (
        <div className="not-found">
            <img src="/avatar.svg" alt="" className="not-found-image" />
            <div>
                <h2>Oops! Page Not Found (404 Error)</h2>
                <p>We're sorry, but the page you're looking for doesn't seem to exist.</p>
                <p>If you typed the URL manually, please double-check the spelling.</p>
                <p>If you clicked on a link, it may be outdated or broken.</p>
            </div>
        </div>
    );
} 