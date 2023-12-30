export const LOCAL_HOST_URL = "http://127.0.0.1:8080"

export const getHeaders = () => {
    return {
        'Authorization': `Bearer ${localStorage.getItem('apiToken')}`
    }
}