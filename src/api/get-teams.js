async function getTeams() {
    const token = window.localStorage.getItem("token");
    const url = `${import.meta.env.VITE_API_URL}/teams`;

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
        const fallbackError = "Error fetching teams";
        const data = await response.json().catch(() => {
            throw new Error(fallbackError);
        });
        const errorMessage = data?.detail || fallbackError;
        throw new Error(errorMessage);
    }

    return await response.json();
}


export default getTeams;