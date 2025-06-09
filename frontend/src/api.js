import axios from "axios"
const api = axios.create({
baseURL:'https://instavivid-e56v.onrender.com/api/v1/',
withCredentials:true
})

export default api