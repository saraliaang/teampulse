import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";
import { useAuth } from "../hooks/use-auth";
import getISOWeekNumber from "../utils/getISOWeekNumber.js";

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

            // 🔹 2. Save token FIRST
            window.localStorage.setItem("token", token);

            // 🔹 3. Add token to context early
            setAuth({ token });

            // 🔹 4. Fetch user basic data from /me
            const meRes = await fetch(`${import.meta.env.VITE_API_URL}/me/`, {
                headers: { Authorization: `Token ${token}` },
            });

            const meData = await meRes.json();
            const userId = meData.id;

            // 🔹 5. Fetch full user info (with logs) from /users/:id
            const fullUserRes = await fetch(
                `${import.meta.env.VITE_API_URL}/users/${userId}`,
                {
                    headers: { Authorization: `Token ${token}` },
                }
            );

            const userData = await fullUserRes.json();

            // Update auth context with full user data
            setAuth({ token, user: userData });

            // 🔹 6. Manager redirect
            if (userData.is_staff) {
                navigate("/manager-dashboard");
                return;
            }

            // 🔹 7. Determine current year-week
            const now = new Date();
            const currentYearWeek = Number(getISOWeekNumber(now));

            // 🔹 8. Logs check
            if (!userData.logged_pulses || userData.logged_pulses.length === 0) {
                console.log("No logs found for this user.");
            }

            console.log("🔥 userData.logged_pulses:", userData.logged_pulses);

            const hasCheckedIn = userData.logged_pulses?.some((pulse) => {
                // console.log("pulse.year_week:", pulse.year_week);
                // console.log("currentYearWeek:", currentYearWeek);
                return pulse.year_week === currentYearWeek;
            });

            // 🔹 9. Redirect based on check-in status
            if (hasCheckedIn) {
                navigate("/user-dashboard");
            } else {
                navigate("/checkin");
            }

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
