import {useState, useEffect} from 'react';
import getTeams from '../api/get-teams';


export default function useTeams(){
    const [teams, setTeams] = useState([]);
    const [teamisLoading, setIsLoading] = useState(true);
    const [error, setError] = useState();
    useEffect(() => {
        getTeams()
        .then((teams) => {
            setTeams(teams);
            setIsLoading(false);
        }).catch((error) => {
            setError(error);
            setIsLoading(false);
        })
    },[])

    return {teams, teamisLoading, error};

}   