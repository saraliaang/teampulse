import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth.js";
import Loader from "./Loader.jsx";

export default function PublicOnly({ children }) {
    const { auth, loading } = useAuth();

    if (loading) {
        return <Loader />;
    }

    if (!auth.token || !auth.user) {
        return children;
    }

    return <Navigate to={auth.user.is_staff ? "/manager-dashboard" : "/user-dashboard"} replace />;
}
