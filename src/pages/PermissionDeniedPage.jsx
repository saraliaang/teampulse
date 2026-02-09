import Logo from "../components/Logo";
import "./PermissionDeniedPage.css";
import { Link } from "react-router-dom";
import DashboardButton from "../components/DashboardButton";
import "./PermissionDeniedPage.css";

export default function PermissionDeniedPage() {
    return (
        <div className="permission-container">
            <div className="permission-box">
                <h1 className="permission-title">You don’t have access to this area</h1>

                <p className="permission-text">
                    This part of teampulse is designed for team managers. 
                    No worries — you can continue exploring the rest of the experience.
                </p>

                <div className="permission-action">
                    <Link to="/">
                        <DashboardButton text="Back to Home" />
                    </Link>
                </div>

            </div>
        </div>
    );
}
