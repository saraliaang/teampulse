import { useCallback, useEffect, useState } from "react";
import getPoints from "../api/get-points";

export default function usePoints() {
    const [points, setPoints] = useState(null);
    const [ptisLoading, setIsLoading] = useState(true);
    const [ptError, setError] = useState(null);

    const extractPoints = (response) =>
        Array.isArray(response) && response.length > 0
            ? response[0]?.points ?? 0
            : 0;

    const refreshPoints = useCallback(async (token) => {
        const response = await getPoints(token);
        const currentPoints = extractPoints(response);
        setPoints(currentPoints);
        return currentPoints;
    }, []);

    useEffect(() => {
        let isMounted = true;
        refreshPoints()
            .then(() => {
                if (!isMounted) return;
                setIsLoading(false);
            })
            .catch((error) => {
                if (!isMounted) return;
                setError(error);
                setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [refreshPoints]);

    return { points, ptisLoading, ptError, refreshPoints };
}
