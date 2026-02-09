// src/components/user/UserWeeklyComparison.jsx
import { useMemo, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

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

function formatWeekLabel(pulse) {
    // e.g. "W48"
    return `W${pulse.week_index}`;
}

export default function UserWeeklyComparison({ loggedPulses }) {
    const [metric, setMetric] = useState("mood"); // 'mood' | 'workload'

    const lastFourWeeksData = useMemo(() => {
        if (!loggedPulses?.length) return [];

        const sorted = [...loggedPulses].sort(
            (a, b) => a.year_week - b.year_week
        );
        const lastFour = sorted.slice(-4);

        return lastFour.map((pulse) => ({
            weekLabel: formatWeekLabel(pulse),
            mood: pulse.mood_value ?? pulse.mood,
            workload: pulse.workload_value ?? pulse.workload,
        }));
    }, [loggedPulses]);

    const tickFormatter = (value) => {
        if (metric === "mood") {
            return MOOD_LABELS[value] || value;
        }
        return WORKLOAD_LABELS[value] || value;
    };

    const activeKey = metric === "mood" ? "mood" : "workload";

    return (
        <div className="user-weekly-card">
            <div className="user-weekly-toggle">
                <button
                    type="button"
                    className={`user-pill-toggle ${metric === "mood" ? "user-pill-toggle--active" : ""
                        }`}
                    onClick={() => setMetric("mood")}
                >
                    Mood
                </button>
                <button
                    type="button"
                    className={`user-pill-toggle ${metric === "workload" ? "user-pill-toggle--active" : ""
                        }`}
                    onClick={() => setMetric("workload")}
                >
                    Workflow
                </button>
            </div>

            {lastFourWeeksData.length === 0 ? (
                <p className="user-weekly-empty">
                    Your first check-in will unlock a weekly trend view.
                </p>
            ) : (
                <div className="user-weekly-chart-wrapper">
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={lastFourWeeksData} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="rgba(0,0,0,0.05)"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="weekLabel"
                                tickMargin={8}
                                axisLine={false}
                                tickLine={false}
                                style={{ fontSize: "0.75rem", fontFamily: "var(--font-body)" }}
                            />
                            <YAxis
                                domain={[1, 4]}
                                allowDecimals={false}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={tickFormatter}
                                tickMargin={12}
                                style={{ fontSize: "0.75rem", fontFamily: "var(--font-body)" }}
                            />
                            <Tooltip
                                formatter={(value) => tickFormatter(value)}
                                labelFormatter={(label) => `Week ${label.replace("W", "")}`}
                                contentStyle={{
                                    borderRadius: 12,
                                    border: "none",
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                                    fontFamily: "var(--font-body)",
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey={activeKey}
                                stroke="#a8d8c4"
                                strokeWidth={3}
                                dot={{ r: 5 }}
                                activeDot={{ r: 7 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            <p className="user-weekly-helper">
                Notice when your{" "}
                {metric === "mood" ? "energy" : "workload"} gently rises or dips
                — that’s your cue to pause, breathe and reset.
            </p>
        </div>
    );
}
