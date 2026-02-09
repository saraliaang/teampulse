import { useEffect, useState } from "react";
import getRewards from "../api/get-rewards";

export default function useRewards() {
    const [rewards, setRewards] = useState([]);
    const [rewardsIsLoading, setIsLoading] = useState(true);
    const [rewardsError, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        getRewards()
            .then((data) => {
                if (!isMounted) return;
                setRewards(Array.isArray(data) ? data : []);
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
    }, []);

    return { rewards, rewardsIsLoading, rewardsError };
}
