import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Layout.css';

export default function Layout() {
    const [panel, setPanel] = useState(null);
    const [showCreate, setShowCreate] = useState(false);

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
                    <h2>{panel === 'search' ? 'Search' : 'Notifications'}</h2>
                </div>
            )}
            <main className="layout-main" onClick={() => setPanel(null)}>
                <Outlet />
            </main>
            {showCreate && <p>Create modal (coming soon)</p>}
        </div>
    );
} 