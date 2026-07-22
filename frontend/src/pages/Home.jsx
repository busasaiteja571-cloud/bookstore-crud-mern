import { useState, useEffect } from 'react';
import { getAllBooks } from '../services/bookService';
import { BookCard } from '../components/BookCard';
import './Home.css'; 

export const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await getAllBooks();
        setBooks(response.data);
      } catch (err) {
        setError('Failed to load store content. Is the backend server running?');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  if (loading) return <p className="loading-text">Loading...</p>;
  if (error) return <p className="error-text">{error}</p>;

  // Derived sections from fetched array
  const latestBooks = books.slice(-4);
  const programmingBooks = books.filter((b) => b.category === 'Programming');
  const aiBooks = books.filter((b) => b.category === 'AI');

  return (
    <div className="home-container">
      <section className="banner">
        <h1>Welcome to ABC Book Store</h1>
        <p>Your one-stop shop for every book you'll ever need.</p>
      </section>

      <section className="book-section">
        <h2>Latest Books</h2>
        <div className="book-grid">
          {latestBooks.map((book) => <BookCard key={book._id} book={book} />)}
        </div>
      </section>

      {programmingBooks.length > 0 && (
        <section className="book-section">
          <h2>Programming Books</h2>
          <div className="book-grid">
            {programmingBooks.map((book) => <BookCard key={book._id} book={book} />)}
          </div>
        </section>
      )}

      {aiBooks.length > 0 && (
        <section className="book-section">
          <h2>AI Books</h2>
          <div className="book-grid">
            {aiBooks.map((book) => <BookCard key={book._id} book={book} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;