import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth.js";
import Loader from "./Loader.jsx";
import getISOWeekNumber from "../utils/getISOWeekNumber.js";

export default function IfCheckedIn({ children, requireCheckedIn = true }) {
    const { auth, loading } = useAuth();
    const [isChecking, setIsChecking] = useState(true);
    const [hasCheckedIn, setHasCheckedIn] = useState(false);

    useEffect(() => {
        let isActive = true;

        async function checkCurrentWeekPulse() {
            if (loading) {
                return;
            }

            if (!auth.token || !auth.user) {
                if (isActive) {
                    setIsChecking(false);
                }
                return;
            }

            if (auth.user.is_staff) {
                if (isActive) {
                    setIsChecking(false);
                }
                return;
            }

            setIsChecking(true);
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/users/${auth.user.id}`,
                    {
                        headers: {
                            Authorization: `Token ${auth.token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to load user check-ins");
                }

                const userData = await response.json();
                const loggedPulses = userData?.logged_pulses ?? [];
                const currentYearWeek = getISOWeekNumber(new Date());
                const checkedInThisWeek = loggedPulses.some(
                    (pulse) => String(pulse?.year_week) === currentYearWeek
                );

                if (isActive) {
                    setHasCheckedIn(checkedInThisWeek);
                }
            } catch (error) {
                if (isActive) {
                    setHasCheckedIn(false);
                }
            } finally {
                if (isActive) {
                    setIsChecking(false);
                }
            }
        }

        checkCurrentWeekPulse();

        return () => {
            isActive = false;
        };
    }, [auth.token, auth.user, loading]);

    if (loading || isChecking) {
        return <Loader />;
    }

    if (!auth.token || !auth.user) {
        return <Navigate to="/login" replace />;
    }

    if (auth.user.is_staff) {
        return <Navigate to="/manager-dashboard" replace />;
    }

    if (requireCheckedIn && !hasCheckedIn) {
        return <Navigate to="/checkin" replace />;
    }

    if (!requireCheckedIn && hasCheckedIn) {
        return <Navigate to="/user-dashboard" replace />;
    }

    return children;
}
