import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth.js";
import Loader from "./Loader.jsx";
import getISOWeekNumber from "../utils/getISOWeekNumber.js";

export default function PublicOnly({ children }) {
    const { auth, loading } = useAuth();
    const [redirectTo, setRedirectTo] = useState(null);
    const [checkingPulse, setCheckingPulse] = useState(false);

    useEffect(() => {
        let isActive = true;

        async function resolveRedirect() {
            if (loading) return;

            if (!auth.token || !auth.user) {
                if (isActive) {
                    setRedirectTo(null);
                    setCheckingPulse(false);
                }
                return;
            }

            if (auth.user.is_staff) {
                if (isActive) {
                    setRedirectTo("/manager-dashboard");
                    setCheckingPulse(false);
                }
                return;
            }

            setCheckingPulse(true);

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
                const hasCheckedInThisWeek = loggedPulses.some(
                    (pulse) => String(pulse?.year_week) === currentYearWeek
                );

                if (isActive) {
                    setRedirectTo(hasCheckedInThisWeek ? "/user-dashboard" : "/checkin");
                }
            } catch (error) {
                if (isActive) {
                    setRedirectTo("/checkin");
                }
            } finally {
                if (isActive) {
                    setCheckingPulse(false);
                }
            }
        }

        resolveRedirect();

        return () => {
            isActive = false;
        };
    }, [auth.token, auth.user, loading]);

    if (loading || checkingPulse) {
        return <Loader />;
    }

    if (!auth.token || !auth.user) {
        return children;
    }

    if (redirectTo) {
        return <Navigate to={redirectTo} replace />;
    }

    return children;
}
