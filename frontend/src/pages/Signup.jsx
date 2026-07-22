import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../services/authService.js';
import { useAuth } from '../context/AuthContext.jsx';

function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(formData);
      await login({ email: formData.email, password: formData.password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign Up</h1>
      {error && <p className="error">{error}</p>}
      
      <input 
        name="name" 
        placeholder="Name" 
        value={formData.name} 
        onChange={handleChange} 
        required 
      />
      
      <input 
        name="email" 
        type="email" 
        placeholder="Email" 
        value={formData.email} 
        onChange={handleChange} 
        required 
      />
      
      <input 
        name="password" 
        type="password" 
        placeholder="Password" 
        value={formData.password} 
        onChange={handleChange} 
        required 
        minLength={6}
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>

      <p className="auth-redirect">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </form>
  );
}

export default Signup;