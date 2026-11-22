import { NavLink } from 'react-router-dom';
import { GoHome, GoHomeFill } from 'react-icons/go';
import { IoSearchOutline, IoCompassOutline, IoCompass, IoHeartOutline } from 'react-icons/io5';
import { RiMessengerLine } from 'react-icons/ri';
import { FiPlusSquare } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

export default function Sidebar({ onSearch, onNotifications, onCreate }) {
    const { user, logout } = useAuth();

    return (
        <aside className="sidebar">
            <h1 className="sidebar-logo">ICHgram</h1>
            <nav className="sidebar-nav">
                <NavLink to="/" end className="sidebar-item">
                    {({ isActive }) => (
                        <>
                            {isActive ? <GoHomeFill /> : <GoHome />}
                            <span>Home</span>
                        </>
                    )}
                </NavLink>
                <button className="sidebar-item" onClick={onSearch}>
                    <IoSearchOutline />
                    <span>Search</span>
                </button>
                <NavLink to="/explore" className="sidebar-item">
                    {({ isActive }) => (
                        <>
                            {isActive ? <IoCompass /> : <IoCompassOutline />}
                            <span>Explore</span>
                        </>
                    )}
                </NavLink>
                <button className="sidebar-item" disabled title="Coming soon">
                    <RiMessengerLine />
                    <span>Messages</span>
                </button>
                <button className="sidebar-item" onClick={onNotifications}>
                    <IoHeartOutline />
                    <span>Notifications</span>
                </button>
                <button className="sidebar-item" onClick={onCreate}>
                    <FiPlusSquare />
                    <span>Create</span>
                </button>
                <NavLink to={`/profile/${user?._id}`} className="sidebar-item">
                    <img
                        className="sidebar-avatar"
                        src={user?.profileImage || '/avatar.svg'}
                        alt=""
                    />
                    <span>Profile</span>
                </NavLink>
            </nav>
            <button className="sidebar-item sidebar-logout" onClick={logout}>
                <span>Log out</span>
            </button>
        </aside>
    );
} 