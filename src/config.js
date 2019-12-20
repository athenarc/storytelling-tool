export const BASE_URL = "https://app-share3d.imsi.athenarc.gr:8082"
export const ENDPOINT = {
    AUTH: {
        LOGIN: BASE_URL + '/auth/login',
        LOGOUT: BASE_URL + '/auth/logout',
        STATUS: BASE_URL + '/auth/status',
        SIGNUP: BASE_URL + '/auth/signup',
    },
    STORIES: BASE_URL + '/stories',
    UPLOADS: BASE_URL + '/assets/upload',
    STORIES_PUBLIC: BASE_URL + '/stories/public',
    ASSETS: {
        SEARCH: BASE_URL + '/assets/search'
    },
    USERS: BASE_URL + '/users'

}