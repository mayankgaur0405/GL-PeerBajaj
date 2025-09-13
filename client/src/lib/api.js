import axios from 'axios'

// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // Check if we're in production (Vercel deployment)
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_BASE || 'https://gl-peerbridge.onrender.com/api'
  }
  // Development mode - use relative path for proxy
  return import.meta.env.VITE_API_BASE || '/api'
}

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response && error.response.status === 401 && !original._retry) {
      original._retry = true
      try {
        await axios.post(getApiBaseUrl() + '/auth/refresh', {}, { withCredentials: true })
        return api(original)
      } catch (_) {
        // fallthrough
      }
    }
    return Promise.reject(error)
  }
)

export default api


