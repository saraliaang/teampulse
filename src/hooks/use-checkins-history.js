import { useState, useEffect } from "react";
import getCheckInsHistory from "../api/get-checkins-history";

export default function useCheckinsHistory() {
    const [pulseLogs, setCheckins] = useState([]);
    const [checkinisLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        getCheckInsHistory()
            .then((data) => {
                setCheckins(data);
                setIsLoading(false);
                console.log("Fetched check-ins history (4 weeks):", data);
            })
            .catch((err) => {
                setError(err);
                setIsLoading(false);
            });
    }, []);

    return { pulseLogs, checkinisLoading, error };
}
