import { LOCAL_HOST_URL, getHeaders } from "@/config"
import axios from "axios"

export const FetchFriends = ({userId, userName}: {userId: string, userName: string}) => {
    return axios({
        method: 'GET',
        headers: getHeaders(),
        url: `${LOCAL_HOST_URL}/api/v0/user/${userId}/friends`,
        params: {
            'user_name': userName
        }
    })
}

export const GetUserDetails = ({userId}: {userId: string}) => {
    return axios({
        method: 'GET',
        headers: getHeaders(),
        url: `${LOCAL_HOST_URL}/api/v0/user/${userId}`
    })
}