import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// BrowserRouter enables client-side routing using the browser's
// History API — URL changes without a full page reload.
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      {
      /* BrowserRouter must wrap the whole App so any component
        inside can use routing hooks (useNavigate, useParams, etc.)
      */
      }
      <BrowserRouter>
      {/* AuthProvider wraps CartProvider — order between the two doesn't
          matter functionally here since neither depends on the other,
          but outermost-to-innermost roughly mirrors "identity, then
          identity-dependent state" as a readability convention. */}
      <AuthProvider>
        {/* CartProvider must wrap App so EVERY component — Navbar,
          BookCard, a future Cart page — can access cart state via useCart() */}
          <CartProvider>
            <App />
          </CartProvider>
      </AuthProvider>
      </BrowserRouter>

  </StrictMode>,
)
