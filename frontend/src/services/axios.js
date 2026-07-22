import axios from 'axios';

// Create a pre-configured axios instance instead of calling
// axios.get('http://localhost:5000/books') everywhere. If the
// backend URL ever changes (e.g. deploying to production), we
// change it in exactly ONE place.
const api = axios.create({
  baseURL: 'https://bookstore-crud-mern.vercel.app',
});

export default api;



