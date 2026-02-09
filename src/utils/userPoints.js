export function calculateWeeklyStreak(loggedPulses) {
    if (!loggedPulses || loggedPulses.length === 0) return 0;

    const weeks = loggedPulses.map((pulse) => pulse.week_index).sort((a, b) => b - a);
    let streak = 1;

    for (let i = 0; i < weeks.length - 1; i++) {
        if (weeks[i] - 1 === weeks[i + 1]) streak += 1;
        else break;
    }

    return streak;
}

export function calculatePoints(loggedPulses) {
    const mindfulWeeks = loggedPulses?.length || 0;
    const streak = calculateWeeklyStreak(loggedPulses);

    return mindfulWeeks * 10 + streak * 10;
}
