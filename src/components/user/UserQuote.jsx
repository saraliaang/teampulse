import "./UserQuote.css";
import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import CardIcon from "../CardIcon";
import DashboardButton from "../DashboardButton";

export default function UserQuote({ firstName, loggedPulses }) {
    if (!loggedPulses || loggedPulses.length === 0) return null;

    const latest = loggedPulses[0];

    // Support both possible field names from backend
    const mood_value = latest.mood_value ?? latest.mood;
    const workload_value = latest.workload_value ?? latest.workload;

    // --- Your mapping logic (cleaned + corrected) ---
    const moodQuotes = {
        high: "Your inner world feels bright this week — ",
        medium: "You’re emotionally steady and open this week  — ",
        low: "Thank you for checking in — it takes strength to acknowledge hard moments — ",
    };

    const workflowQuotes = {
        high: "breathe it in and carry this grounded momentum forward.",
        medium: "it’s okay to sit with the in-between moments. Your effort still matters.",
        low: "be kind to yourself — you don’t have to hold everything alone.",
    };

    // mood/workflow values are 1–4 → convert to keys
    const getCategory = (value) => {
        if (value === 4) return "high";
        if (value === 3) return "medium";
        return "low"; // 1 or 2
    };

    const moodKey = getCategory(mood_value);
    const workflowKey = getCategory(workload_value);

    const finalQuote = moodQuotes[moodKey] + workflowQuotes[workflowKey];

    return (
        <div className="userquote-container">
            {/* Keep your icon */}
            <div className="userquote-icon">
                <CardIcon icon={faQuoteLeft} size="lg" color="var(--primary)" />
            </div>

            {/* Quote text */}
            <p className="userquote-text">{finalQuote}</p>

            {/* ⭐ New Kudos Button */}
            <div className="userquote-kudos">
                <DashboardButton
                    text="Send Kudos"
                    fontSize="var(--text-sm)"
                    padding="0.45rem 1rem"
                    letterSpacing="0.03em"
                    borderRadius="12px"
                    // onClick handled by your teammate
                />
            </div>
        </div>
    );
}
