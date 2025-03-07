import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9090/api/v1',
    headers:{
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    withCredentials: true
});