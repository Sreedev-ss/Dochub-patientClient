import axios from 'axios'

const baseUrl = "http://localhost:8001"

export const authServer = axios.create({
        baseURL : `${baseUrl}/auth`
})