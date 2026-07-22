import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookForm from '../components/BookForm';
import { createBook } from '../services/bookService';
import './AddBook.css';

export const AddBook = () => {

  const [message, setMessage] = useState('');
  const [serverError, setServerError] = useState('');

  // useNavigate gives us a function to programmatically change routes
  // (e.g., after a successful save) - the js equivalent of Express's
  // res.redirect(), but entirely client-side.

  const navigate = useNavigate();
  const handleAdd = async (bookData) => {
    
    try {
      await createBook(bookData);
      setMessage('Book Added Successfully');
      setServerError('');

      // Brief pause so the user can see the success message before
      // being redirected to the full book list.
      setTimeout(() => navigate('/books'), 1000);
    } catch (err) {
      // This is where SERVER-SIDE (Mongoose) validation errors surface,
      // even if client-side validation somehow passed something bad.
      setServerError(err.response?.data.message || 'Failed to add book');
    }
  };

  return (
    <div className="add-book-container">
      <h1>Add Book</h1>
      {message && <p className="success">{message}</p>}
      {serverError && <p className="error">{serverError}</p>}
      <BookForm onSubmit={handleAdd} submitLabel="Save" />
    </div>
  );
};