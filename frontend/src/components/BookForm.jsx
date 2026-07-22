import { useState, useEffect } from 'react';
import './BookForm.css'
const CATEGORIES = ['Programming', 'Database', 'AI', 'Fiction', 'Kids', 'History'];

const DEFAULT_FIELDS = {
  title: '',
  author: '',
  price: '',
  category: 'Programming',
  stock: '',
  description: '',
  image: '',
};

function BookForm({ initialData, onSubmit, submitLabel }) {
  // Initialize state. If initialData is ready immediately, use it. Otherwise, use defaults.
  const [formData, setFormData] = useState({ ...DEFAULT_FIELDS, ...initialData });
  const [errors, setErrors] = useState({});

  // CRITICAL FIX: Listen for initialData updates from the parent component (e.g., after an API fetch)
  useEffect(() => {
    if (initialData) {
      setFormData({ ...DEFAULT_FIELDS, ...initialData });
    }
  }, [initialData]);

  // One handler for every input, keyed by the input's `name` attribute
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Form validation logic
  const validate = () => {
    const newErrors = {};
    if (!formData.title?.trim()) newErrors.title = 'Title is required';
    if (!formData.author?.trim()) newErrors.author = 'Author is required';
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.stock === '' || Number(formData.stock) < 0) newErrors.stock = 'Stock cannot be negative';
    if (!formData.description || formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return; // Stop here if client-side checks fail

    // Convert price/stock to Number to match backend Mongoose schemas
    onSubmit({
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    });
  };

  const handleReset = () => {
    setFormData({ ...DEFAULT_FIELDS, ...initialData });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} />
        {errors.title && <span className="error">{errors.title}</span>}
      </div>

      <div>
        <input name="author" placeholder="Author" value={formData.author} onChange={handleChange} />
        {errors.author && <span className="error">{errors.author}</span>}
      </div>

      <div>
        <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} />
        {errors.price && <span className="error">{errors.price}</span>}
      </div>

      <div>
        <select name="category" value={formData.category} onChange={handleChange}>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <input name="stock" type="number" placeholder="Stock" value={formData.stock} onChange={handleChange} />
        {errors.stock && <span className="error">{errors.stock}</span>}
      </div>

      <div>
        <textarea name="description" placeholder="Description (min 20 characters)" value={formData.description} onChange={handleChange} />
        {errors.description && <span className="error">{errors.description}</span>}
      </div>

      <div>
        <input name="image" placeholder="Image URL (optional)" value={formData.image} onChange={handleChange} />
      </div>

      <button type="submit">{submitLabel}</button>
      <button type="button" onClick={handleReset}>Reset</button>
    </form>
  );
}

export default BookForm;
