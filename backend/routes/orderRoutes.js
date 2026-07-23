import express from 'express';
import { checkout,getAllOrders,getMyOrders } from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';


const router = express.Router();

// All order routes require login — there's no "browsing orders"
// as a guest, unlike books.
router.post('/checkout', protect, checkout);
router.get('/my', protect, getMyOrders);
router.get('/', protect, adminOnly, getAllOrders); // admin-only, for Phase 15's dashboard

export default router;