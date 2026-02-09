import { faFire, faStar } from "@fortawesome/free-solid-svg-icons";
import CardIcon from "../CardIcon";
import "./UserStats.css";
import { calculateWeeklyStreak } from "../../utils/userPoints";

export default function UserStats({ loggedPulses, points = 0 }) {

    // Weekly streak calculation
    const streak = calculateWeeklyStreak(loggedPulses);

    // Total mindful weeks = total number of checkins
    const mindfulWeeks = loggedPulses?.length || 0;

    return (
        <div className="userstats-container">

            {/* LEFT – STREAK */}
            <div className="userstats-block">
                <CardIcon icon={faFire} size="lg" />
                <p className="userstats-value">{streak}</p>
                <p className="userstats-label">Week Streak</p>
            </div>

            {/* CENTER – MINDFUL BADGE */}
            <div className="userstats-badge">
                <div className="badge-number">{mindfulWeeks}</div>
                <div className="badge-label">Mindful Weeks</div>
            </div>

            {/* RIGHT – POINTS */}
            <div className="userstats-block">
                <CardIcon icon={faStar} size="lg" />
                <p className="userstats-value">{points}</p>
                <p className="userstats-label">Points</p>
            </div>

        </div>
    );
}
