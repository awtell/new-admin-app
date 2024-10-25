import axios, { AxiosInstance } from "axios";

// Function to get token from localStorage
const getToken = () => localStorage.getItem("JWT_Token");
const getXsrfToken = () => localStorage.getItem("XSRF-TOKEN");

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const instance: AxiosInstance = axios.create({
    headers: {
        "Content-Type": "application/json",
    }
});

// Interceptor to set the token in headers for each request
instance.interceptors.request.use((config) => {
    const token = getToken();
    const xsrfToken = getXsrfToken();

    if (token) {
        config.headers['Authorization'] = token;
    }
    if (xsrfToken) {
        config.headers['X-XSRF-TOKEN'] = xsrfToken;
    }
    return config;
}, (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
});

// Interceptor to log responses
instance.interceptors.response.use((response) => {
    return response;
}, (error) => {
    console.error('Response Error:', error);
    return Promise.reject(error);
});

export default instance;