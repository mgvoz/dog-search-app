import axios from 'axios';
const BASE_URL = 'https://frontend-take-home-service.fetch.com/';

export default axios.create({
    baseURL: BASE_URL
});