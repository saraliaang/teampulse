import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFaceGrinStars, faSmileBeam, faFlushed, faTired, faSun, faCloudSun, faCloudRain, faCloudBolt
} from '@fortawesome/free-solid-svg-icons';
import { motion } from "framer-motion";
import { createCheckIn } from "../api/post-createcheckin";
import { useAuth } from "../hooks/use-auth";
import { useState } from "react";
import { calculateWeeklyStreak } from "../utils/userPoints";
import usePoints from "../hooks/use-points";
import usePostPoint from "../hooks/use-post-point";

export default function CheckInForm() {
    const [mood, setMood] = useState(null);
    const [workload, setWorkload] = useState(null);
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const { auth, loading } = useAuth();
    const { refreshPoints } = usePoints();
    const { submitPoints } = usePostPoint();

    const moodOptions = [
        { id: 4, label: "Empowered", icon: faFaceGrinStars },
        { id: 3, label: "Calm", icon: faSmileBeam },
        { id: 2, label: "Anxious", icon: faFlushed },
        { id: 1, label: "Angry", icon: faTired }
    ];

    const workloadOptions = [
        { id: 4, label: "Light", icon: faSun },
        { id: 3, label: "Manageable", icon: faCloudSun },
        { id: 2, label: "Under Pressure", icon: faCloudRain },
        { id: 1, label: "Overwhelmed", icon: faCloudBolt }
    ];
    function getUTCFromLocal() {
        const now = new Date();

        // extract local components
        const year = now.getFullYear();
        const month = now.getMonth();
        const day = now.getDate();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const second = now.getSeconds();
        const ms = now.getMilliseconds();

        // build a local-time date, then convert to UTC automatically
        const localDate = new Date(year, month, day, hour, minute, second, ms);

        return localDate.toISOString(); // correct UTC that matches local time
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!mood || !workload) {
            setErrorMessage("Choose how you're feeling first.");
            return;
        }

        if (loading) {
            setErrorMessage("Still loading your profile. Please wait.");
            return;
        }

        if (!auth?.token || !auth?.user) {
            setErrorMessage("You must be logged in to submit a check-in.");
            return;
        }

        if (!auth.user.team) {
            setErrorMessage("No team assigned to your account.");
            return;
        }

        if (!auth?.token) {
            setErrorMessage("You must be logged in to submit a check-in.");
            return;
        }

        setIsSubmitting(true);

        const payload = {
            mood,
            workload,
            comment: notes,
            team: auth.user.team,
            timestamp_local: getUTCFromLocal(),
        };

        try {
            // 1) Create the check-in first (required before any points update).
            const checkInResponse = await createCheckIn(payload, auth.token);
            // 2) Fetch current points from backend so we add on top of the latest value.
            const currentPoints = await refreshPoints(auth.token);

            // 3) Pull the freshest logged_pulses so streak is calculated accurately.
            const userResponse = await fetch(
                `${import.meta.env.VITE_API_URL}/users/${auth.user.id}`,
                {
                    headers: {
                        Authorization: `Token ${auth.token}`,
                    },
                }
            );

            if (!userResponse.ok) {
                throw new Error("Unable to refresh streak data.");
            }

            const userData = await userResponse.json();
            // Use the updated pulse list for streak calculation.
            const freshPulses = userData?.logged_pulses ?? [];
            // 4) Compute weekly streak and bonus (every 3 streaks -> +20).
            const streakCount = calculateWeeklyStreak(freshPulses);
            const bonusPoints = streakCount > 0 && streakCount % 3 === 0 ? 20 : 0;
            // 5) New total points = current + base 10 + bonus.
            const nextPoints = currentPoints + 10 + bonusPoints;

            // 6) Post the new points total to backend.
            await submitPoints({ points: nextPoints }, auth.token);
            setSuccessMessage("Thank you for checking in.");
            setMood(null);
            setWorkload(null);
            setNotes("");
            navigate("/user-dashboard");
        } catch (err) {
            console.error(err);
            setErrorMessage(err.message || "Check-in failed.");
        }

        setIsSubmitting(false);
    };


    return (
        <div className="survey-container">


            <h2>Take a moment to check in with yourself.</h2>

            <form onSubmit={handleSubmit} className="survey-form">

                {/* Mood */}
                <section>
                    <h3>How is your mood?</h3>
                    <div className="options-grid">
                        {moodOptions.map((option) => (
                            <motion.button
                                type="button"
                                key={option.id}
                                whileTap={{ scale: 0.95 }}
                                className={`option-card ${mood === option.id ? "selected" : ""}`}
                                onClick={() => setMood(option.id)}
                            >
                                <FontAwesomeIcon icon={option.icon} size="2x" />
                                <span>{option.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </section>

                {/* Workload */}
                <section>
                    <h3>Where is your workload at?</h3>
                    <div className="options-grid">
                        {workloadOptions.map((option) => (
                            <motion.button
                                type="button"
                                key={option.id}
                                whileTap={{ scale: 0.95 }}
                                className={`option-card ${workload === option.id ? "selected" : ""}`}
                                onClick={() => setWorkload(option.id)}
                            >
                                <FontAwesomeIcon icon={option.icon} size="2x" />
                                <span>{option.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </section>

                {/* Notes */}
                <section>
                    <h3>Anything you'd like to share?</h3>
                    <textarea
                        placeholder="Your thoughts are safe here..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="notes-box"
                    />
                </section>

                {/* Errors / Success */}
                {errorMessage && <p className="error-msg">{errorMessage}</p>}
                {successMessage && <p className="success-msg">{successMessage}</p>}

                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Check-In"}
                </button>
            </form>
        </div>
    );
}
