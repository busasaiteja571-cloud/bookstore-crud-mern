import { useParams } from "react-router-dom"
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { getBookById } from "../services/bookService";
import './BookDetails.css'

export const BookDetails = () => {

  const { id } = useParams();
  const { addToCart } = useCart();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try{
        const response = await getBookById(id);
        setBook(response.data);

      }catch(err){
        setError('Book not found');

      }finally{
        setLoading(false);
      }
    };
    fetchBook();
  },[id]); //re-fetch if the user navigates from one book's details straight to another
  if(loading) return <p>Loading...</p>;
  if(error) return <p>{error}</p>
  return (
    <div className="book-details">
      {book.image && <img src={book.image} alt={book.title} />}
      <h1>{book.title}</h1>
      <p>by {book.author}</p>
      <p>₹{book.price}</p>
      <p>Category: {book.category}</p>
      <p>Stock: {book.stock}</p>
      <p>{book.description}</p>
      <button onClick={() => addToCart(book)}>Add to Cart</button>
    </div>
  )
}
