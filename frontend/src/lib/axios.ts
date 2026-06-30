import axios from 'axios'

// Server-side (SSR/SSG) uses INTERNAL_API_URL to reach the API container over
// the Docker internal network. The browser always uses NEXT_PUBLIC_API_URL.
const baseURL =
  typeof window === 'undefined'
    ? process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL,
  withCredentials: true,
})

export default api
