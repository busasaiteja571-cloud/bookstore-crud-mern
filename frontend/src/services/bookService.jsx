import api from "./api";

// Centralizing API calls here (rather than calling axios directly
// inside components) means components don't need to know the exact
// URL or HTTP method — if the backend route ever changes, we only
// update it in one place.

export const getAllBooks = () => api.get('/books');
export const getBookById = (id) => api.get(`/books/${id}`);
export const createBook = (bookData) => api.post('/books', bookData);
export const updateBookById = (id, bookData) => api.put(`/books/${id}`, bookData);
export const deleteBookById = (id) => api.delete(`/books/${id}`);
export const searchBooks = (title) => api.get(`/books/search?title=${title}`);
export const getBooksByCategory = (category) => api.get(`/books/category/${category}`);
export const sortBooks = (order) => api.get(`/books/sort/${order}`);