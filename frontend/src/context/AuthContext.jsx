import { createContext, useContext, useState, useEffect } from 'react';
import { getMe, login as loginRequest, logout as logoutRequest } from '../services/authService.js';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // checkingAuth: true only during the VERY FIRST check on page load.
  // Without this, the app would briefly render as "logged out" for
  // everyone (even a genuinely logged-in admin) for a split second
  // while the /auth/me request is still in flight.
  const [checkingAuth, setCheckingAuth] = useState(true);

  // On first mount, ask the backend "who am I?" using whatever
  // cookie the browser already has (if any). This is how a logged-in
  // user stays logged in across a page refresh — the cookie persists,
  // even though React's in-memory state (user) resets on every reload.
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getMe();
        setUser(response.data);
      } catch (error) {
        // 401 here just means "not logged in" — not a real error,
        // so we leave user as null rather than showing an error message.
        setUser(null);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    const response = await loginRequest(credentials);
    setUser(response.data.user);
  };

  const logout = async () => {
    await logoutRequest();
    setUser(null);
  };

  // Derived, not stored — recalculated from `user` on every render,
  // same pattern as totalPrice in CartContext (Phase 7).
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isAdmin, checkingAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}