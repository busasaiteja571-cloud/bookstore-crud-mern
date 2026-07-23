import mongoose from "mongoose";

// A sub-schema for items WITHIN an order. We don't give this its
// own collection/model — it only ever exists nested inside an
// Order, so an inline schema (no separate mongoose.model call) is
// the right tool here.
const orderItemSchema = new mongoose.Schema({
  book: {
    // ObjectId + ref: 'Book' tells Mongoose this field stores a
    // reference to a document in the 'books' collection — similar
    // to a foreign key. We can later "populate" this to pull in
    // the full book details instead of just the id.
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  // We SNAPSHOT title/price at order time, rather than only storing
  // a reference. If the admin later changes a book's price, past
  // orders should still show what the customer actually paid —
  // not today's price. This is a common and important pattern for
  // any order/invoice-like data.
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema], // an array of the sub-schema above
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['placed', 'shipped', 'delivered', 'cancelled'],
      default: 'placed',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);