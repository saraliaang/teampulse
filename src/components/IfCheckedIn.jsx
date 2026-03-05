import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/use-auth.js";
import Loader from "./Loader.jsx";
import getISOWeekNumber from "../utils/getISOWeekNumber.js";

const JUST_CHECKED_IN_WINDOW_MS = 2 * 60 * 1000;

export default function IfCheckedIn({ children, requireCheckedIn = true }) {
    const { auth, loading } = useAuth();
    const location = useLocation();
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
            const currentYearWeek = getISOWeekNumber(new Date());
            const state = location.state ?? {};
            const justCheckedInFromState =
                requireCheckedIn &&
                Number(state?.userId) === Number(auth.user.id) &&
                String(state?.yearWeek) === currentYearWeek &&
                Number.isFinite(state?.justCheckedInAt) &&
                Date.now() - state.justCheckedInAt <= JUST_CHECKED_IN_WINDOW_MS;

            try {
                const fetchCheckedInFromApi = async () => {
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
                    return loggedPulses.some(
                        (pulse) => String(pulse?.year_week) === currentYearWeek
                    );
                };

                let checkedInThisWeek = await fetchCheckedInFromApi();
                if (!checkedInThisWeek && requireCheckedIn) {
                    await new Promise((resolve) => setTimeout(resolve, 800));
                    checkedInThisWeek = await fetchCheckedInFromApi();
                }

                if (isActive) {
                    setHasCheckedIn(checkedInThisWeek || justCheckedInFromState);
                }
            } catch (error) {
                if (isActive) {
                    setHasCheckedIn(justCheckedInFromState);
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
    }, [auth.token, auth.user, loading, location.state, requireCheckedIn]);

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
