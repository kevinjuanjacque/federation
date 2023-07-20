import axios from 'axios';

export const API = ()=>{
    const headers:any = {}
    console.log((localStorage.getItem("token")))
    const token = localStorage.getItem("token")
    if(token){
        headers["Authorization"] = `Bearer ${token}`
    }
    console.log(headers)
    return axios.create({
        headers,
        baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    })
};

