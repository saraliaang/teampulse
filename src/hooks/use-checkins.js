import { useState, useEffect } from "react";
import getCheckInsByWeek from "../api/get-checkins-by-week";

export default function useCheckins() {
    const [pulseLogs, setCheckins] = useState([]);
    const [checkinisLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        getCheckInsByWeek()
            .then((data) => {
                setCheckins(data);
                setIsLoading(false);
                console.log("Fetched check-ins (current week):", data);
            })
            .catch((err) => {
                setError(err);
                setIsLoading(false);
            });
    }, []);

    return { pulseLogs, checkinisLoading, error };
}
