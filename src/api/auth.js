import axios from './axios';

export const API = 'http://localhost:3002/admin';

export const registerRequest = (user) => axios.post("/register", user);
export const loginRequest = (user) => axios.post("/login", user);

let authToken = null;

export const getAuthToken = () => {
    return authToken;
};

export const verifyTokenRequest = () => {
    
    if (!authToken) {
        return Promise.reject(new Error("Token JWT no está presente"));
    }

    return axios.get('/verify', {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });
};

export const setAuthToken = (token) => {
    authToken = token;
    
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common["Authorization"];
    }
};