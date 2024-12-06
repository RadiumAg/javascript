import axios from  'axios'

const axiosInstance = axios.create({
    baseURL :'http://localhost:30005'
})

export async function login(username:string, password:string){}