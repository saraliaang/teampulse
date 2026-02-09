export async function postPoint(payload, token) {
    const url = `${import.meta.env.VITE_API_URL}/user_points/`;

    if (!token) {
        throw new Error("Token is required to submit points change.");
    }

    const pointData = {
        points:payload.points
    };

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`, 
        },
        body: JSON.stringify(pointData),
    });

    if (!response.ok) {
        const fallbackError = "Error submitting check-in";
        const data = await response.json().catch(() => {
            throw new Error(fallbackError);
        });
        const errorMessage = data?.detail || fallbackError;
        throw new Error(errorMessage);
    }

    return await response.json();
}
