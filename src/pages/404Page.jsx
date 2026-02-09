import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import DashboardButton from "../components/DashboardButton";
import "./404Page.css";

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="notfound-container">
            <div className="notfound-content">
                <h1 className="notfound-title">Page not found</h1>
                <p className="notfound-text">
                    We’re sorry — it looks like this page doesn’t exist.
                    Let’s guide you back to a safe place.
                </p>

                <div className="notfound-button">
                    <DashboardButton
                        text="Go Home"
                        onClick={() => navigate("/")}
                    />
                </div>

            </div>
        </div>
    );
}
