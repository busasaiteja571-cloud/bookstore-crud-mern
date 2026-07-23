import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Book from '../models/Book.js';

// @route   POST /orders/checkout
// @desc    Simulate a checkout: validate stock, create an order,
//          decrement stock. No real payment — matches your scoping decision.
export const checkout = async (req, res) => {
  // A MongoDB session lets us group multiple writes (decrementing
  // stock on several books + creating one order) into a single
  // all-or-nothing transaction. If ANY step fails partway through
  // (e.g. book #3 of 5 is out of stock), everything rolls back —
  // we never end up with stock decremented but no order created.
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // req.body.items looks like: [{ bookId, quantity }, ...] —
    // sent by the frontend's cart contents at checkout time.
    const { items } = req.body;

    if (!items || items.length === 0) {
      throw new Error('Cart is empty');
    }

    const orderItems = [];
    let totalAmount = 0;

    // Loop sequentially (not Promise.all) because each iteration's
    // stock check must reflect the PREVIOUS iteration's update if
    // the same book somehow appears twice — sequential keeps this simple and correct.
    for (const item of items) {
      const book = await Book.findById(item.bookId).session(session);

      if (!book) {
        throw new Error(`Book not found: ${item.bookId}`);
      }
      if (book.stock < item.quantity) {
        throw new Error(`Not enough stock for "${book.title}" (only ${book.stock} left)`);
      }

      // Decrement stock as part of the same transaction.
      book.stock -= item.quantity;
      await book.save({ session });

      // Snapshot title/price NOW, at order time (see schema comment above).
      orderItems.push({
        book: book._id,
        title: book.title,
        price: book.price,
        quantity: item.quantity,
      });
      totalAmount += book.price * item.quantity;
    }

    // req.user.id comes from the JWT payload, attached by the
    // 'protect' middleware — we never trust a userId sent in the
    // request body, since that could be spoofed to place an order
    // as someone else.
    const order = await Order.create(
      [{ user: req.user.id, items: orderItems, totalAmount }],
      { session }
    );

    // Both the stock decrements AND the order creation succeeded —
    // commit makes all of it permanent at once.
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: 'Order placed successfully', order: order[0] });
  } catch (error) {
    // Any thrown error above (bad stock, missing book, etc.) rolls
    // back EVERY write made in this transaction — no partial state.
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: error.message });
  }
};

// @route   GET /orders/my
// @desc    Get the logged-in user's own order history
export  const getMyOrders = async (req, res) => {
  try {
    // Only orders belonging to the CURRENTLY logged-in user —
    // req.user.id again, never a userId from the request itself.
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /orders  (admin only)
// @desc    Get ALL orders across all users — for the admin dashboard (Phase 15)
export const getAllOrders = async (req, res) => {
  try {
    // .populate('user', 'name email') replaces the raw user ObjectId
    // with the actual referenced User document, but only pulling
    // the 'name' and 'email' fields — not the password hash.
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

