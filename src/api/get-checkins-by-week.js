import getISOWeekNumber from "../utils/getISOWeekNumber";

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
