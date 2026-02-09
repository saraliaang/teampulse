import { Navigate } from "react-router-dom";
import { useAuth } from '../hooks/use-auth.js';
import Loader from '../components/Loader'

export default function ManagerOnly({ children }) {
    const { auth, setAuth, loading } = useAuth();

    if (loading) {
        return <Loader />;
    }
    if (!auth.user) {
        return <Navigate to="/login" replace />;
    }
    if (auth.user.is_staff === false) {
        localStorage.removeItem('token');
        return <Navigate to="/no-permission" replace />;
    }
    return children;
}