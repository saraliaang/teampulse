export default async function postSignup(userData) {
    const url = `${import.meta.env.VITE_API_URL}/users/`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const fallbackError = "Error creating user";

        const data = await response.json().catch(() => {
            throw new Error(fallbackError);
        });

        const errorMessage = data?.detail || data?.message || fallbackError;
        throw new Error(errorMessage);
    }

    return await response.json();
}
