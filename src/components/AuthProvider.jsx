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
                console.log("⚠️ No token found in localStorage — skipping user restore.");
                return;
            }

            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/me/`,
                    {
                        headers: {
                            Authorization: `Token ${auth.token}`,
                        },
                    }
                );
                setAuth((prev) => ({
                    ...prev,
                    user: res.data,
                }));

                console.log("✅ Auth recorded successfully!");
                console.log("🔑 Token:", auth.token);
                console.log("👤 User:", res.data);

            } catch (err) {
                console.error("Failed to restore user:", err);
                setAuth((prev) => ({ ...prev, user: null }));

            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, [auth.token]);

    return (
        <AuthContext.Provider value={{ auth, setAuth, loading }}>
            {props.children}
        </AuthContext.Provider>
    );
};