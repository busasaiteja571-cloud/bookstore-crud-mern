import express from 'express';
const router = express.Router();

import {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  searchBooks,
  getBooksByCategory,
  sortBooks,
} from '../controllers/bookController.js';

// IMPORTANT: order matters here. Express matches routes top-to-bottom,
// and stops at the FIRST match. More specific static paths like
// '/search' MUST come before the dynamic '/:id' route below —
// otherwise Express would treat "search" as an :id value and route
// it to getBookById instead of searchBooks.
router.get('/search', searchBooks);
router.get('/category/:category', getBooksByCategory);
router.get('/sort/:order', sortBooks);

router.post('/', addBook);
router.get('/', getAllBooks);
router.get('/:id', getBookById);      // must stay AFTER the specific routes above
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

export default router;