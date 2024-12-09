import axios from  'axios'

const axiosInstance = axios.create({
    baseURL :'http://localhost:30005',
    timeout : 3000
})

export async function login(username:string, password:string){
    return await axiosInstance.post('/user/loogin', {username,password})
}