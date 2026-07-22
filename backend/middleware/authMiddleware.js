// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

// 'protect' verifies a valid JWT exists before letting the request
// continue to the actual route handler. Any route wrapped with this
// middleware requires the user to be LOGGED IN (any role).
 export const protect = (req, res, next) => {
  // req.cookies is populated by the cookie-parser middleware we'll
  // add to app.js in Step F — without it, req.cookies is undefined.
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // jwt.verify throws if the token is invalid, tampered with, or
    // expired. If it succeeds, it returns the original payload we
    // signed back in generateToken() — { id, role }.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach it so later handlers/middleware can read req.user.id / req.user.role
    next(); // pass control to the next middleware or the route handler
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

// 'adminOnly' must run AFTER 'protect' — it assumes req.user already
// exists. It adds a SECOND gate: logged in is not enough, you must
// also have role === 'admin'.
export const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};
