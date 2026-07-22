import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import './BookCard.css'
//This component recives a single 'book' object as a prop and
//renders it as a card, matching your spec's page 2 requirements.

export const BookCard  = ( {book}) => {
  const { addToCart } = useCart();
  return (
    <div className="book-card">
        {book.image && <img src={book.image} alt={book.title}/> }     
        <h3>{book.title}</h3>
        <p>by {book.author}</p>
        <p>₹{book.price}</p>
        <p>{book.category}</p>
        <p>In stock : {book.stock}</p>   

        {/* Link to the dynamic route defined in Phase 5's App.jsx */}
        <Link to={`/books/${book._id}`}>View Details</Link>
        <button onClick={() => addToCart(book)}>Add to Cart</button>
    </div>
  )
}
