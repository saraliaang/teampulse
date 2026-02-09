async function getMoods(){
    const url = `${import.meta.env.VITE_API_URL}/moods`;

    const response = await fetch(url, { method: 'GET' });

    if (!response.ok){
        const fallbackError = 'Error fetch fundraisers';
        const data = await response.json().catch(()=> {
                throw new Error(fallbackError)
        })

        const errorMessage = data?.detail ?? fallbackError;
        // = data?.detail ? data.detail : fallbackError;
        throw new Error(errorMessage);
    }

    return await response.json();
}

export default getMoods;