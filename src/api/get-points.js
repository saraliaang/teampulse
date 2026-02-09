async function getPoints(token) {
    const authToken = token || window.localStorage.getItem("token");
    const url = `${import.meta.env.VITE_API_URL}/user_points/`;

    const headers = {
        "Content-Type": "application/json",
    };

    if (authToken) {
        headers.Authorization = `Token ${authToken}`;
    }

    const response = await fetch(url, {
        method: "GET",
        headers
    });

    if (!response.ok) {
        const fallbackError = "Error fetching points";
        const data = await response.json().catch(() => {
            throw new Error(fallbackError);
        });
        const errorMessage = data?.detail || fallbackError;
        throw new Error(errorMessage);
    }

    return await response.json();
}


export default getPoints;
