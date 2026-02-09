// src/components/user/UserDashboard.jsx
import UserStats from "./UserStats";
import UserWeeklyComparison from "./UserWeeklyComparison";
import UserQuote from "./UserQuote";

export default function UserDashboard({
    firstName,
    loggedPulses,
    isManagerView,
    points,
}) {
    return (
        <div className="user-dashboard-layout">
            <section className="user-section--stats">
                <div className="user-section-header">
                    <h2>  {isManagerView
                        ? `Stats`
                        : "My Stats"}
                    </h2>
                </div>
                <div className="user-stats-card-section">
                    <p>
                        {firstName&&!isManagerView
                            ? `${firstName}, every weekly check-in is a step to a more sustainable workflow.`
                            : "Every weekly check-in is a step toward a more sustainable workflow."}
                    </p>
                    <UserStats loggedPulses={loggedPulses} points={points} />

                </div>
            </section>

            <section className="user-section--weekly">
                <div className="user-section-header">

                    <h2>Weekly comparison</h2>
                    <div className="user-section-header user-section">
                        <UserWeeklyComparison loggedPulses={loggedPulses} />
                    </div>
                </div>
            </section>
            {!isManagerView && (
            <section className="user-section user-section--quote">
                <UserQuote firstName={firstName} loggedPulses={loggedPulses} />
            </section>
            )}
        </div>
    );
}
