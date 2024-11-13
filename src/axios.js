import axios from "axios";
import { getToken } from "../src/utils/utils";

const http = axios.create({
    baseURL: "https://api.spotify.com/v1/"
});

http.interceptors.request.use(config =>{
    const authToken = localStorage.getItem('token');
    
    if (authToken) {
        config.headers.Authorization = `${authToken}`;
    } else {
        getToken();
        const authToken = localStorage.getItem('token');
        config.headers.Authorization = `${authToken}`;
    }
    return config;
});

http.interceptors.response.use(
    response =>{
        return response
    },
    error => {
        const status = error.response ? error.response.status : null;

        if (status === 401) {
            
        } else if (status === 404) {
            
        } else {

        }
        return Promise.reject(error);
    }
)
export default http;
