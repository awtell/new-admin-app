import axios, { AxiosInstance } from "axios";
const token = localStorage.getItem("JWT_Token");

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const axiosInstance: AxiosInstance = axios.create({
    headers: {
        "Authorization": token,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    }
});

axiosInstance.interceptors.request.use((config) => {
    if (token) {
        config.headers['Authorization'] = token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});




export default axiosInstance;