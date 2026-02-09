export async function createCheckIn(payload, token) {
    const url = `${import.meta.env.VITE_API_URL}/pulse_logs/`;

    if (!token) {
        throw new Error("Token is required to submit check-in.");
    }

    const checkInData = {
    mood: Number(payload.mood),
    workload: Number(payload.workload),
    comment: payload.comment || "",
    team: Number(payload.team),  // <- pega do payload, não de auth
    timestamp_local: payload.timestamp || new Date().toISOString(),
    };

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`, 
        },
        body: JSON.stringify(checkInData),
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
