import {useState, useEffect} from 'react';
import getMoods from '../api/get-moods';

export default function useMoods(){
    const [moods, setMoods] = useState(null);
    const [moodisLoading, setIsLoading] = useState(true);
    const [moodError, setError] = useState();
    useEffect(() =>{
        getMoods()
        .then((moods) => {
            setMoods(moods);
            setIsLoading(false);
        }).catch((error) => {
            setError(error);
            setIsLoading(false);
        })
    },[])

    return {moods, moodisLoading, moodError}
}