import { createContext, useContext, useState } from 'react';

// createContext makes a "channel" that any descendant component can
// tap into via useContext, without props being manually passed down
// through every intermediate component ("prop drilling").
const CartContext = createContext();

// A custom hook wrapping useContext — lets components write
// `const { cart } = useCart()` instead of importing CartContext
// and calling useContext(CartContext) everywhere.
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (book) => {
    setCart((prevCart) => {
      // Check if this book is already in the cart.
      const existing = prevCart.find((item) => item._id === book._id);

      if (existing) {
        // If it exists, increment its quantity instead of adding
        // a duplicate entry — map() returns a NEW array, keeping
        // state updates immutable (never mutate prevCart directly).
        return prevCart.map((item) =>
          item._id === book._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // New item: spread the existing cart, add this one with quantity 1.
      return [...prevCart, { ...book, quantity: 1 }];
    });
  };

  const removeFromCart = (bookId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== bookId));
  };

  // Derived value, recalculated on every render from current cart state —
  // no need to store "total" separately, which could get out of sync.
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}