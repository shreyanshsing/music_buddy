import { LOCAL_HOST_URL } from "@/config"
import axios from "axios"

interface UserPayload {
    user_name: string
    email: string
    password: string
}

export const CreateUser = (data: UserPayload) => {
    return axios({
        method: 'POST',
        url: `${LOCAL_HOST_URL}/api/v0/auth/register`,
        data: data
    })
}

interface LoginPayload {
    email: string
    password: string
}

export const LoginUser = (data: LoginPayload) => {
    return axios({
        method: 'POST',
        url: `${LOCAL_HOST_URL}/api/v0/auth/login`,
        data: data
    })
}