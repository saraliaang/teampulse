import './AllCheckinView.css'

function formatDate(timestampLocal) {
    if (!timestampLocal) return "";
    const date = new Date(timestampLocal);
    return date.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
}

export default function AllCheckinsView({ logs }) {
    if (!logs || logs.length === 0) {
        return (
            <section className="manager-section">
                <h2>All Team Check-ins</h2>
                <p>No check-ins for this week.</p>
            </section>
        );
    }

    // Sort newest → oldest
    const sorted = [...logs].sort(
        (a, b) => new Date(b.timestamp_local) - new Date(a.timestamp_local)
    );

    return (
        <section className="manager-section">


            <div className="manager-checkins-list">
                {sorted.map((item) => {
                    return (
                        <article key={item.id} className="manager-checkin-card">
                            {/* Date */}
                            <div className="manager-checkin-header">
                                <p className="manager-checkin-date">
                                    Week {item.week_index} • {formatDate(item.timestamp_local)}
                                </p>
                                <span className="manager-checkin-badge">Check-in</span>
                            </div>

                            {/* Names */}
                            <div className="manager-checkin-info-row">
                                <p className="manager-checkin-name">
                                    {item.first_name} {item.last_name}
                                </p>
                            </div>

                            {/* Comment + Tags */}
                            <div className="manager-checkin-info-row">
                                {item.comment && item.comment.trim() !== ""
                                    ? <p className="manager-checkin-comment">“{item.comment}”</p>
                                    : <p className="manager-checkin-comment">The user didn't leave any comment.</p>
                                }
                                <div className="manager-checkin-tags">
                                    <span className="manager-chip manager-chip--mood">
                                        {item.mood_description}
                                    </span>
                                    <span className="manager-chip manager-chip--workload">
                                        {item.workload_description}
                                    </span>
                                </div>
                            </div>

                        </article>
                    );
                })}
            </div>
        </section>
    );
}
