import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import NotFound from './pages/NotFound';
import EditProfile from './pages/EditProfile';

function PrivateRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <p>Loading...</p>;
    return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <p>Loading...</p>;
    return user ? <Navigate to="/" /> : children;
}

function App() {
    return (
        <Routes>
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
                 <Route path="/" element={<Home />} />
                 <Route path="/explore" element={<Explore />} />
                 <Route path="/profile/:id" element={<Profile />} />
                 <Route path="/accounts/edit" element={<EditProfile />} />
                 <Route path="*" element={<NotFound />} />
            </Route> 
        </Routes>
    );
}

export default App;
