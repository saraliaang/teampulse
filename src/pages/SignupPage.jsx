import SignupForm from "../components/SignupForm";
import "./SignupPage.css";
import Logo from "../components/Logo";

function SignupPage({ onNavigateToLogin }) {
    return (
        <div className="signup-page-wrapper">
            <div className="signup-card">
                <h2 className="signup-title">
                    Create your account ✨
                </h2>

                <SignupForm onToggle={onNavigateToLogin} />
            </div>
        </div>
    );
}

export default SignupPage;
