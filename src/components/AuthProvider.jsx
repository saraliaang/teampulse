import { createContext, useState, useEffect } from "react";
import axios from "axios";

// Here we create the Context
export const AuthContext = createContext();

export const AuthProvider = (props) => {
    const [auth, setAuth] = useState({
        token: window.localStorage.getItem("token"),
        user: null,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            if (!auth.token) {
                setLoading(false);
                return;
            }

            // Skip the restore call after login when user data is already present.
            if (auth.user) {
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                const meRes = await axios.get(
                    `${import.meta.env.VITE_API_URL}/me/`,
                    {
                        headers: {
                            Authorization: `Token ${auth.token}`,
                        },
                    }
                );
                const userRes = await axios.get(
                    `${import.meta.env.VITE_API_URL}/users/${meRes.data.id}`,
                    {
                        headers: {
                            Authorization: `Token ${auth.token}`,
                        },
                    }
                );
                setAuth((prev) => ({
                    ...prev,
                    user: userRes.data,
                }));
            } catch (err) {
                console.error("Failed to restore user:", err);
                setAuth((prev) => ({ ...prev, user: null }));
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, [auth.token, auth.user]);

    return (
        <AuthContext.Provider value={{ auth, setAuth, loading }}>
            {props.children}
        </AuthContext.Provider>
    );
};
