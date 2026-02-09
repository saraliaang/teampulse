import { useState, useEffect } from 'react';
import getNeedsAttention from '../api/get-needs-attention.js';

export function useNeedsAttention(teamId) {
    const [needsAttention, setNeedsAttention] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNeedsAttention = async () => {
            try {
                setLoading(true);
                const data = await getNeedsAttention();
                // Filter by team if teamId is provided
                const filtered = teamId ? data.filter(member => member.team === teamId) : data;
                setNeedsAttention(filtered);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNeedsAttention();
    }, [teamId]);

    return { needsAttention, loading, error };
}