import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000/api',
  withCredentials: true
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response && error.response.status === 401 && !original._retry) {
      original._retry = true
      try {
        await axios.post((import.meta.env.VITE_API_BASE || 'http://localhost:5000/api') + '/auth/refresh', {}, { withCredentials: true })
        return api(original)
      } catch (_) {
        // fallthrough
      }
    }
    return Promise.reject(error)
  }
)

export default api


