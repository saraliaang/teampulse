// src/pages/UserDashboardPage.jsx
import { useEffect, useState, useMemo } from "react";
import "./UserDashboardPage.css";
import { useAuth } from '../hooks/use-auth';
import { useParams } from "react-router-dom";


import DashboardButton from "../components/DashboardButton";
import UserDashboard from "../components/user/UserDashboard";
import UserCheckins from "../components/user/UserCheckins";
import GardenView from "../components/user/GardenView";
import Loader from "../components/Loader";
import usePoints from "../hooks/use-points";
import useRewards from "../hooks/use-rewards";


export default function UserDashboardPage() {
    const [view, setView] = useState("dashboard");
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { auth, setAuth } = useAuth();
    const { userId } = useParams();
    const isManager = auth?.user?.is_staff;   // from your backend
    const isManagerView = Boolean(userId) && isManager;
    const targetUserId = isManagerView ? userId : auth?.user?.id;

    // Fetch user + logged pulses
    useEffect(() => {
        async function fetchUser() {
            if (!auth?.token || !auth?.user || !auth.user.id) {
                return;
            } try {
                setIsLoading(true);
                const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${targetUserId}`, {
                    headers: {
                        "Authorization": `Token ${auth.token}`,
                    },
                });
                if (!res.ok) {
                    throw new Error("Unable to load your wellbeing data just now.");
                }
                const data = await res.json();
                setUserData(data);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchUser();
    }, [auth.user]);

    const loggedPulses = useMemo(
        () => userData?.logged_pulses ?? [],
        [userData]
    );
    const { points } = usePoints();
    const { rewards, rewardsIsLoading, rewardsError } = useRewards();

    const isPageLoading = isLoading || rewardsIsLoading;
    const pageError =
        error ||
        (rewardsError ? rewardsError.message || "Unable to load rewards." : null);
    const safePoints = points ?? 0;

    return (
        <div className="user-dashboard-page">
            <header className="user-dashboard-header flex">
                <div className="user-dashboard-title-group">
                    <p className="user-dashboard-eyebrow">Profile</p>
                    <h1 className="user-dashboard-title">
                        {isManagerView
                            ? `${userData?.first_name}'s wellbeing hub`
                            : "Your wellbeing hub"}
                    </h1>
                    <p className="user-dashboard-subtitle">
                        A gentle space to check in and reflect.
                    </p>
                </div>

                <div className="user-dashboard-toggle">
                    <DashboardButton
                        text="Dashboard"
                        fontSize="var(--text-sm)"
                        padding="0.4rem 0.9rem"
                        letterSpacing="0.5px"

                        isActive={view === "dashboard"}
                        onClick={() => setView("dashboard")}
                    />
                    <DashboardButton
                        text="All Check-ins"
                        fontSize="var(--text-sm)"
                        padding="0.4rem 0.9rem"
                        letterSpacing="0.5px"
                        isActive={view === "checkins"}
                        onClick={() => setView("checkins")}
                    />
                    <DashboardButton
                        text="Wellbeing Garden"
                        fontSize="var(--text-sm)"
                        padding="0.4rem 0.9rem"
                        letterSpacing="0.5px"
                        isActive={view === "garden"}
                        onClick={() => setView("garden")}
                    />
                </div>
            </header>

            {isPageLoading && (
                <div className="user-dashboard-state-message">
                    <Loader />
                </div>
            )}

            {pageError && !isPageLoading && (
                <div className="user-dashboard-state-message user-dashboard-error">
                    {pageError}
                </div>
            )}

            {!isPageLoading && !pageError && (
                <main className="user-dashboard-main">
                    {view === "dashboard" && (
                        <UserDashboard
                            firstName={userData?.first_name}
                            loggedPulses={loggedPulses}
                            isManagerView={isManagerView}
                            points={safePoints}
                        />
                    )}

                    {view === "checkins" && (
                        <UserCheckins
                            firstName={userData?.first_name}
                            loggedPulses={loggedPulses}
                        />
                    )}
                    {view === "garden" && (
                        <GardenView currentPoints={safePoints} rewards={rewards} />
                    )}
                </main>
            )}
        </div>
    );
}
