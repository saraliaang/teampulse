import {useState, useEffect} from 'react';
import getWorkloads from '../api/get-workloads';

export default function useWorkloads(){
    const [workloads, setWorkloads] = useState(null);
    const [workloadisLoading, setIsLoading] = useState(true);
    const [workflowError, setError] = useState();
    useEffect(() =>{
        getWorkloads()
        .then((workloads) => {
            setWorkloads(workloads);
            setIsLoading(false);
        }).catch((error) => {
            setError(error);
            setIsLoading(false);
        })
    },[])

    return {workloads, workloadisLoading, workflowError}
}