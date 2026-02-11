export default function getISOWeekNumber(date = new Date()) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);

    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const year = d.getUTCFullYear();
    const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    const weekPadded = String(week).padStart(2, "0");

    return `${year}${weekPadded}`;
}
