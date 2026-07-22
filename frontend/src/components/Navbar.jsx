import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext";
import './Navbar.css';
export const Navbar = () => {
    const { cart } = useCart();
    const itemCount = cart.reduce((sum,item) => sum + item.quantity,0);
  return (
    <nav> 
        {/* Link renders an <a> tag but intercepts the click to update
          the URL via JS, WITHOUT triggering a full page reload —
          this is the core benefit of client-side routing. */}
        
        <Link to='/'>Home</Link>
        <Link to='/books'>Books</Link>
        <Link to='/add-book'>Add Book</Link>
        <Link to='/cart'>🛒 Cart ({itemCount})</Link>
    </nav>
  )
}
