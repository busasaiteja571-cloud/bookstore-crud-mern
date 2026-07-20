import mongoose from 'mongoose';

// A Schema defines the SHAPE of a document: field names, types,
// and validation rules. This is Mongoose's main value-add over
// raw MongoDB, which is schema-less by default.
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
    },
    price: {
      type: Number,
      required: true,
      min: [0.01, 'Price must be greater than 0'], // matches spec: "Greater than 0"
    },
    category: {
      type: String,
      required: true,
      enum: ['Programming', 'Database', 'AI', 'Fiction', 'Kids', 'History'],
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
    },
    description: {
      type: String,
      required: true,
      minlength: [20, 'Description must be at least 20 characters'],
    },
    image: {
      type: String,
      required: false, // spec says optional
    },
  },
  {
    // Automatically adds and manages createdAt / updatedAt fields,
    // matching the MongoDB collection fields in your spec —
    // we don't have to set these by hand.
    timestamps: true,
  }
);

// mongoose.model() compiles the schema into a Model — a constructor
// you use to create, read, update, and delete documents. The string
// 'Book' tells Mongoose to use the 'books' collection (lowercased,
// pluralized) in MongoDB.
export default mongoose.model('Book', bookSchema);