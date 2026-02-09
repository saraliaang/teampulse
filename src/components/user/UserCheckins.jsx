// src/components/user/UserCheckins.jsx

const MOOD_LABELS = {
    1: "Angry",
    2: "Anxious",
    3: "Calm",
    4: "Empowered",
};

const WORKLOAD_LABELS = {
    1: "Overwhelmed",
    2: "Under pressure",
    3: "Manageable load",
    4: "Light",
};

function formatDate(timestampLocal) {
    if (!timestampLocal) return "";
    const date = new Date(timestampLocal);
    return date.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
}

export default function UserCheckins({ firstName, loggedPulses }) {
    if (!loggedPulses?.length) {
        return (
            <div className="user-dashboard-layout">
                <section className="user-section">
                    <div className="user-section-header">
                        <h2>All check-ins</h2>
                        <p>
                            Once you start checking in weekly, you’ll see a gentle timeline of
                            your mood and workflow here.
                        </p>
                    </div>
                    <div className="user-dashboard-empty-card">
                        <p>
                            {firstName
                                ? `${firstName}, your first check-in is the starting point of your story.`
                                : "Your first check-in is the starting point of your story."}
                        </p>
                    </div>
                </section>
            </div>
        );
    }

    const sorted = [...loggedPulses].sort(
        (a, b) => new Date(b.timestamp_local) - new Date(a.timestamp_local)
    );

    return (
        <div className="user-dashboard-layout">
            <section className="user-section">
                <div className="user-section-header">
                    <h2>All check-ins</h2>
                </div>

                <div className="user-checkins-list">
                    {sorted.map((pulse) => {
                        const mood = MOOD_LABELS[pulse.mood_value ?? pulse.mood];
                        const workload =
                            WORKLOAD_LABELS[pulse.workload_value ?? pulse.workload];

                        return (
                            <article key={pulse.id} className="user-checkin-card">
                                <div className="user-checkin-header">
                                    <p className="user-checkin-date">
                                        Week {pulse.week_index} • {formatDate(pulse.timestamp_local)}
                                    </p>
                                    <span className="user-checkin-badge">Check-in</span>
                                </div>

                                <div className="user-checkin-tags">
                                    <span className="user-chip user-chip--mood">{mood}</span>
                                    <span className="user-chip user-chip--workload">{workload}</span>
                                </div>

                                {pulse.comment && (
                                    <p className="user-checkin-comment">“{pulse.comment}”</p>
                                )}
                            </article>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
