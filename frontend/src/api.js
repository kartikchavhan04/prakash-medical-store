import axios from 'axios'

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim()
if (!configuredApiUrl && !import.meta.env.DEV) {
  throw new Error('VITE_API_URL must be set to the backend API origin for production builds.')
}

export const API_BASE = (configuredApiUrl || `http://${window.location.hostname}:5000`).replace(/\/$/, '')
const api = axios.create({ baseURL: `${API_BASE}/api`, timeout: 15000 })
api.interceptors.request.use((config) => {
  const method = (config.method || 'get').toLowerCase()
  const url = config.url || ''
  const isAdminApi = url.startsWith('/admin') || url.startsWith('/contact/messages') || (['post', 'put', 'patch', 'delete'].includes(method) && (url.startsWith('/products') || url.startsWith('/staff')))
  const token = localStorage.getItem(isAdminApi ? 'admin_token' : 'token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
export function imageUrl(path) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  if (path.startsWith('/images/')) return path
  if (path.startsWith('images/')) return `/${path}`
  return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`
}
export default api
