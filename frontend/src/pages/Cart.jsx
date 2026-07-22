import { useCart } from "../context/CartContext";


export const Cart = () => {

    const { cart , removeFromCart, totalPrice } = useCart();

    if(cart.length === 0) return <p>Your cart is empty.</p>
  return (
    <div>
        <h1> Your Cart</h1>
        {cart.map((item) => (
            <div key={item._id} className="cart-item">
                <span>{item.title}</span>
                <span>x{item.quantity}</span>
                <span>₹ {item.price * item.quantity}</span>
                <button onClick={() =>removeFromCart(item._id)}>Remove</button>
            </div>

        ))}
        {/* totalPrice is DERIVED state from Phase 7's CartContext —
          it recalculates automatically whenever cart changes,
          so it's never out of sync. */}
        <h2>Total: ₹{totalPrice}</h2>
    </div>
  );
}
