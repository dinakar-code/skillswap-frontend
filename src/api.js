import axios from 'axios'

const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/+$/, '')

const api = axios.create({
  baseURL: apiUrl.endsWith('/api') ? apiUrl : `${apiUrl}/api`,
})

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('skillswap-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
