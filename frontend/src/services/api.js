import axios from 'axios';

// Create a pre-configured axios instance instead of calling
// axios.get('http://localhost:5000/books') everywhere. If the
// backend URL ever changes (e.g. deploying to production), we
// change it in exactly ONE place.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // Required so the browser attaches the httpOnly cookie to every
  // request, AND so it stores the cookie the backend sets in its
  // response. Without this, cookies are ignored entirely — even
  // though the backend's cors({ credentials: true }) is correctly
  // configured, the browser needs BOTH sides to opt in.

  withCredentials : true,
});

export default api;



