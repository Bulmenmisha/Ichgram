import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Layout.css';
import CreatePost from './CreatePost';
import SearchPanel from './SearchPanel';
import NotificationsPanel from './NotificationsPanel'; 

export default function Layout() {
    const [panel, setPanel] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const togglePanel = (name) => {
        setPanel(panel === name ? null : name);
    };

    return (
        <div className="layout">
            <Sidebar
                onSearch={() => togglePanel('search')}
                onNotifications={() => togglePanel('notifications')}
                onCreate={() => setShowCreate(true)}
            />
                        {panel && (
                <div className="side-panel">
                    {panel === 'search' ? (
                        <SearchPanel onClose={() => setPanel(null)} />
                    ) : (
                        <NotificationsPanel onClose={() => setPanel(null)} />
                    )}
                </div>
            )}
            <main className="layout-main" onClick={() => setPanel(null)}>
            <Outlet key={refreshKey} />
            </main>
            {showCreate && (
    <CreatePost
        onClose={() => setShowCreate(false)}
        onCreated={() => setRefreshKey(refreshKey + 1)}
    />
)}
        </div>
    );
} 