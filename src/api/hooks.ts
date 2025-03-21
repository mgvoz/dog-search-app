import axios from './axios';
import { AxiosResponse } from 'axios';
import { Filters } from '../models/filters';
import { useEffect, useState } from 'react';
import { Dog } from '../models/dog';


export function useBreedData () {
    const [breedValues, setBreedValues] = useState<string[]>([]);
    const [breedErrMsg, setBreedErrMsg] = useState('');
    
    useEffect(() => {
        axios.get('dogs/breeds',
            {
                withCredentials: true
            }
        ).then((response: AxiosResponse) => {
            setBreedValues(response.data)
        })
        .catch((err) => {
            setBreedErrMsg(err);
        });
    }, [])
    return { breedValues, breedErrMsg }
};

export function useDogSearch (filters: Filters) {
    const [totalRecords, setTotalRecords] = useState(0);
    const [searchErrMsg, setSearchErrMsg] = useState('');
    const [dogs, setDogs] = useState<Dog[]>([]);

    useEffect(() => {
        axios.get('dogs/search',
            {
                params: filters,
                withCredentials: true
            }
        )
        .then((response: AxiosResponse) => {
            setTotalRecords(response.data.total)
            return axios.post('dogs', response.data.resultIds,
                {
                    withCredentials: true
                }
            ).then((dogData: AxiosResponse) => {
                setDogs(dogData.data);
            })
            .catch((err) => {
                setSearchErrMsg(err);
            })
        })
        .catch((err) => {
            setSearchErrMsg(err);
        });;
    }, [filters])
    return { dogs, totalRecords, searchErrMsg };
}

export async function useLogin(name: string = "", email: string = ""): Promise<AxiosResponse> {
    return await axios.post('auth/login',
        JSON.stringify({ name, email }),
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        }
    );
}

export function useLogout (): void {
    axios.post('auth/logout',
        {
            withCredentials: true
        }
    );
}

export async function useMatch(ids: string[]): Promise<AxiosResponse> {
    return await axios.post('dogs/match', ids,
        {
            withCredentials: true
        })
        .then((response: AxiosResponse) => {
            console.log(response)
            return axios.post('dogs', [response.data.match],
                {
                    withCredentials: true
                });
        });
}