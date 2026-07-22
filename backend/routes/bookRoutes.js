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
import { adminOnly, protect } from '../middleware/authMiddleware.js';

// IMPORTANT: order matters here. Express matches routes top-to-bottom,
// and stops at the FIRST match. More specific static paths like
// '/search' MUST come before the dynamic '/:id' route below —
// otherwise Express would treat "search" as an :id value and route
// it to getBookById instead of searchBooks.
router.get('/search', searchBooks);
router.get('/category/:category', getBooksByCategory);
router.get('/sort/:order', sortBooks);

//Writes require BOTH a valid login (protect) AND the admin role
//( adminOnly) -middleware run left to rignt, so protect fires
//first, attaching req.user; adminOnly then reads req.user.role.
router.post('/',protect,adminOnly , addBook);
router.put('/:id',protect,adminOnly, updateBook);
router.delete('/:id', protect,adminOnly, deleteBook);
 
router.get('/', getAllBooks);
router.get('/:id', getBookById);      // must stay AFTER the specific routes above

export default router;