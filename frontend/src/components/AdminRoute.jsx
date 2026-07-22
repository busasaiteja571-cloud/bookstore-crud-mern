// src/components/AdminRoute.jsx

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// A wrapper component: renders its children ONLY if the current
// user is an admin; otherwise redirects. This closes the gap that
// hiding a <Link> alone doesn't — someone can still type the URL
// directly, and this catches that case on the frontend (the
// backend middleware is still the REAL gate either way).
function AdminRoute({ children }) {
  const { isAdmin, checkingAuth } = useAuth();

  // Avoid a flash-redirect while we're still checking auth on
  // initial page load (see AuthContext's checkingAuth from Step C).
  if (checkingAuth) return <p>Loading...</p>;

  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
}
export default AdminRoute;