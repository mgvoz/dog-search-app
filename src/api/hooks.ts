import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from './axios';
import { AxiosResponse } from 'axios';
import { Filters } from '../models/filters';
import { Location } from '../models/location';
import { Dog } from '../models/dog';

export function useBreedData () {
    const [breedValues, setBreedValues] = useState<string[]>([]);
    const [breedErrMsg, setBreedErrMsg] = useState('');
    const navigate = useNavigate();
    
    useEffect(() => {
        axios.get('dogs/breeds',
            {
                withCredentials: true
            }
        ).then((response: AxiosResponse) => {
            setBreedValues(response.data)
        })
        .catch((err) => {
            if (err.response && err.response.status == 401) {
                navigate('/');
            } else {
                setBreedErrMsg(err.message)
            }
        });
    }, [])
    return { breedValues, breedErrMsg }
};

export function useDogSearch (filters: Filters) {
    const [totalRecords, setTotalRecords] = useState(0);
    const [searchErrMsg, setSearchErrMsg] = useState('');
    const [dogs, setDogs] = useState<Dog[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        let tempZipCodes: string[] | undefined = [];
        if (filters.locations && filters.locations?.length > 0) {
            tempZipCodes = filters.zipCodes;
            let tempLocationZipCodes = filters.locations?.map((location) => { return location.zip_code })
            tempLocationZipCodes?.forEach((code) => tempZipCodes?.push(code));
        }
        let newFilters = { ...filters, zipCodes: tempZipCodes };
        delete newFilters.locations;
        axios.get('dogs/search',
            {
                params: newFilters,
                withCredentials: true,
                validateStatus: function (status) {
                    return status < 500;
                }
            }
        )
        .then((response: AxiosResponse) => {
            setTotalRecords(response.data.total)
            return axios.post('dogs', response.data.resultIds,
                {
                    withCredentials: true
                }
            ).then((dogData: AxiosResponse) => {
                let zips = dogData.data.map((dog: Dog) => dog.zip_code);
                let tempDogs = dogData.data;
                return axios.post('locations', zips,
                    {
                        withCredentials: true
                    })
                    .then((locations) => { 
                        let pairDogsWithLocation = tempDogs.map((dog: Dog) => {
                            let dogLocation = locations.data.filter((location: Location) => { return location.zip_code == dog.zip_code })[0];
                            let tempDog: Dog = {
                                ...dog,
                                city: dogLocation.city,
                                state: dogLocation.state
                            }
                            return tempDog;
                        });
                        setDogs(pairDogsWithLocation);
                    })
                    .catch((err) => {
                        setSearchErrMsg(err.message);
                    })
            })
            .catch((err) => {
                setSearchErrMsg(err.message);
            })
        })
        .catch((err) => {
            if (err.response && err.response.status == 401) {
                navigate('/');
            } else {
                setSearchErrMsg(err.message)
            }
        });
    }, [filters])
    return { dogs, totalRecords, searchErrMsg };
}

export function useLocationSearch () {
    const [locationValues, setLocationValues] = useState<Location[]>([]);
    const [locationErrMsg, setLocationErrMsg] = useState('');
    const navigate = useNavigate();
    
    useEffect(() => {
        axios.post('locations/search', {size: 10000},
            {
                withCredentials: true
            }
        ).then((response: AxiosResponse) => {
            let seen = Object.create(null);
            let uniqueLocations = response.data.results.filter((o: any) => {
                let key = ['city', 'state'].map(k => o[k]).join('|');
                if (!seen[key]) {
                    seen[key] = true;
                    return true;
                }
            });
            setLocationValues(uniqueLocations.sort((a:Location, b:Location) => a.city.localeCompare(b.city)))
        })
        .catch((err) => {
            if (err.response && err.response.status == 401) {
                navigate('/');
            } else {
                setLocationErrMsg(err.message)
            }
        });
    }, [])
    return { locationValues, locationErrMsg }
};

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
            return axios.post('dogs', [response.data.match],
                {
                    withCredentials: true
                });
        });
}