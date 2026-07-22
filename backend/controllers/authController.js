import jwt from 'jsonwebtoken';
import User from '../models/User.js'

// Small helper — generates a signed JWT containing the user's id
// and role. We deliberately do NOT put the password or email in
// here; the payload should be the minimum needed to identify and
// authorize the user on future requests.
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Shared cookie options — httpOnly is the key security property:
// it means document.cookie in browser JS CANNOT read this cookie,
// which blocks a whole class of XSS attacks from stealing the token.
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // HTTPS-only in prod, allows HTTP in local dev
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, in milliseconds
};

// @route   POST /auth/signup
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // role is deliberately NOT read from req.body — even if someone
    // POSTs { "role": "admin" } directly, the schema default ('user')
    // wins, because we never pass role through here at all.
    const user = await User.create({ name, email, password });

    const token = generateToken(user);
    res.cookie('token', token, cookieOptions);

    res.status(201).json({
      message: 'Signup successful',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @route   POST /auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    // Deliberately vague error message — "Invalid credentials" for
    // BOTH "no such user" and "wrong password". Being specific
    // (e.g. "no account with this email") would let an attacker
    // enumerate which emails are registered.
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.cookie('token', token, cookieOptions);

    res.status(200).json({
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /auth/logout
export const logout = (req, res) => {
  // Overwrite the cookie with an empty value and immediate expiry —
  // this is the standard way to "delete" a cookie, since there's no
  // direct cookie.delete() on the server side.
  res.cookie('token', '', { ...cookieOptions, maxAge: 0 });
  res.status(200).json({ message: 'Logged out' });
};

// @route   GET /auth/me
// @desc    Returns the currently logged-in user (used by the frontend
//          on page load to check "am I still logged in?")
export const getMe = async (req, res) => {
  // req.user is attached by the 'protect' middleware (Step E) —
  // if we reached this line at all, the token was already verified.
  const user = await User.findById(req.user.id).select('-password');
  res.status(200).json(user);
};

