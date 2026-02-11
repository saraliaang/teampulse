import getISOWeekNumber from "../utils/getISOWeekNumber";

async function getCheckInsHistory() {
    // Get the current week number
    const currentDate = new Date();
    const currentWeekNumber = getISOWeekNumber(currentDate);
    
    // Extract year and week from format YYYYWW
    const currentYear = parseInt(currentWeekNumber.substring(0, 4));
    const currentWeek = parseInt(currentWeekNumber.substring(4, 6));
    
    // Calculate last 4 weeks
    const weekNumbers = [];
    let year = currentYear;
    let week = currentWeek;
    
    for (let i = 3; i >= 0; i--) {
        week = currentWeek - i;
        year = currentYear;
        
        // Handle week wraparound (go to previous year)
        if (week < 1) {
            year -= 1;
            week += 52; // Assuming 52 weeks per year
        }
        
        const weekPadded = String(week).padStart(2, "0");
        weekNumbers.push(`${year}${weekPadded}`);
    }
    
    const token = window.localStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = `Token ${token}`;
    }

    try {
        // Fetch all weeks in parallel
        const promises = weekNumbers.map(weekNumber => {
            const url = `${import.meta.env.VITE_API_URL}/pulse_logs/?year_week=${weekNumber}`;
            return fetch(url, {
                method: "GET",
                headers
            }).then(response => {
                if (!response.ok) {
                    console.warn(`No data for week ${weekNumber}`);
                    return [];
                }
                return response.json();
            }).catch(err => {
                console.warn(`Error fetching week ${weekNumber}:`, err);
                return [];
            });
        });

        const allData = await Promise.all(promises);
        // Combine all weeks into a single array
        const combined = allData.flat();
        console.log("Fetched combined history:", combined);
        return combined;
    } catch (error) {
        console.error("Error fetching check-ins history:", error);
        throw error;
    }
}

export default getCheckInsHistory;
