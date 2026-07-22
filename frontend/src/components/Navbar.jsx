import { Link , useNavigate} from "react-router-dom"
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import './Navbar.css';
export const Navbar = () => {
    const { cart } = useCart();
    const { user, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const itemCount = cart.reduce((sum,item) => sum + item.quantity,0);

    const handleLogout = async () => {
      await logout();
      navigate('/');
    }
  return (
    <nav> 
        {/* Link renders an <a> tag but intercepts the click to update
          the URL via JS, WITHOUT triggering a full page reload —
          this is the core benefit of client-side routing. */}
        
        <Link to='/'>Home</Link>
        <Link to='/books'>Books</Link>
        {/* Add Book link only rendered for admins — this is a UX
          nicety, NOT the actual security boundary. The real
          protection is the backend's protect + adminOnly middleware
          from Phase 12a; hiding the link just avoids showing
          non-admins a button that would fail anyway. */}
        {isAdmin && <Link to="/add-book">Add Book</Link>}

        
        <Link to='/cart'>🛒 Cart ({itemCount})</Link>

        {user ? (
          <>
            <span> Hi, {user.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
    </nav>
  );
}
