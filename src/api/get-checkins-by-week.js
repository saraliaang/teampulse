async function getCheckInsByWeek() {
    
    const currentDate = new Date();
    const WeekNumber = getISOWeekNumber(currentDate);
    
    const url = `${import.meta.env.VITE_API_URL}/pulse_logs/?year_week=${WeekNumber}`;
    const token = window.localStorage.getItem("token");
    

    const headers = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = `Token ${token}`;
    }

    const response = await fetch(url, {
        method: "GET",
        headers
    });


    if (!response.ok) {
        const fallbackError = "Error fetching check-ins";

        const data = await response.json().catch(() => {
            throw new Error(fallbackError);
        });

        const errorMessage = data?.detail || fallbackError;
        throw new Error(errorMessage);
    }

    return await response.json();
}

export default getCheckInsByWeek;



function getISOWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);

    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const year = d.getUTCFullYear();
    
    const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    const weekPadded = String(week).padStart(2, "0");

    return `${year}${weekPadded}`;
}
