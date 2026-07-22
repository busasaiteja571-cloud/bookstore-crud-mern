import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// BrowserRouter enables client-side routing using the browser's
// History API — URL changes without a full page reload.
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      {
      /* BrowserRouter must wrap the whole App so any component
        inside can use routing hooks (useNavigate, useParams, etc.)
      */
      }
      <BrowserRouter>
        {/* CartProvider must wrap App so EVERY component — Navbar,
          BookCard, a future Cart page — can access cart state via useCart() */}
          <CartProvider>
            <App />
          </CartProvider>
      </BrowserRouter>

  </StrictMode>,
)
