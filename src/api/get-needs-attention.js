import getISOWeekNumber from "../utils/getISOWeekNumber";

async function getNeedsAttention() {
    const currentDate = new Date();
    const weekNumber = getISOWeekNumber(currentDate);
    
    const url = `${import.meta.env.VITE_API_URL}/pulse_logs/?year_week=${weekNumber}`;
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
        const fallbackError = 'Error fetching pulse logs';
        const data = await response.json().catch(() => {
            throw new Error(fallbackError);
        });

        const errorMessage = data?.detail ?? fallbackError;
        throw new Error(errorMessage);
    }

    const pulseLogs = await response.json();
    const usersNeedingAttention = pulseLogs.filter(log => 
        log.mood === 1 || log.workload === 1
    );

    // Fetch user details for each user needing attention
    const usersWithDetails = await Promise.all(
        usersNeedingAttention.map(async (log) => {
            const userResponse = await fetch(
                `${import.meta.env.VITE_API_URL}/users/${log.user}`,
                { 
                    method: "GET",
                    headers
                }
            );
            const userData = await userResponse.json();
            return {
                ...log,
                userName: `${userData.first_name} ${userData.last_name}`
            };
        })
    );

    return [...new Map(usersWithDetails.map(item => [item.user, item])).values()];
}

export default getNeedsAttention;
