import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";
import { useAuth } from "../hooks/use-auth";

function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { setAuth } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        try {
            // 🔹 1. LOGIN request
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api-token-auth/`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Login failed.");
                return;
            }

            const token = data.token;

            // 🔹 2. Save token for future reloads
            window.localStorage.setItem("token", token);

            // 🔹 3. Fetch user basic data from /me
            const meRes = await fetch(`${import.meta.env.VITE_API_URL}/me/`, {
                headers: { Authorization: `Token ${token}` },
            });

            const meData = await meRes.json();
            const userId = meData.id;

            // 🔹 4. Fetch full user info (with logs) from /users/:id
            const fullUserRes = await fetch(
                `${import.meta.env.VITE_API_URL}/users/${userId}`,
                {
                    headers: { Authorization: `Token ${token}` },
                }
            );

            const userData = await fullUserRes.json();

            // Update auth context once with the complete user payload.
            setAuth({ token, user: userData });

            // 🔹 5. Manager redirect
            if (userData.is_staff) {
                navigate("/manager-dashboard");
                return;
            }

            // Non-manager users are routed through IfCheckedIn guard.
            navigate("/user-dashboard");

        } catch (err) {
            console.error(err);
            setError("Login failed — please try again.");
        }
    };

    return (
        <div className="login-page">
            <form className="login-form" onSubmit={handleSubmit}>
                {error && <div className="error-box">{error}</div>}

                <div className="input-group">
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button type="submit" className="login-button">
                    Login
                </button>

                <p className="switch-page-text">
                    Don't have an account? <a href="/signup">Sign up here</a>
                </p>
            </form>
        </div>
    );
}

export default LoginForm;
