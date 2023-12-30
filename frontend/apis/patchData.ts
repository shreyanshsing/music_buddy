import { LOCAL_HOST_URL } from "@/config"
import axios from "axios"

interface UpdateUserPayload {
    id: string
    password?: string
    profile_url?: string
    recently_watched?: string
    clear_watch_list?: boolean
}

export const UpdateUser = ({ id, password, profile_url, recently_watched, clear_watch_list }: UpdateUserPayload) => {
    return axios({
        url: `${LOCAL_HOST_URL}/api/v0/user/${id}`,
        method: 'PATCH',
        data: {
            'password': password,
            'profile_url': profile_url,
            'recently_watched': recently_watched,
            'clear_watch_list': clear_watch_list
        }
    })
}