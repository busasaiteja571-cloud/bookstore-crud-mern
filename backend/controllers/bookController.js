import Book from '../models/Book.js';
 
// @route   POST /books
// @desc    Add a new book 
export const addBook = async (req, res) => {
  try {
    // req.body is populated by the express.json() middleware from Phase 1.
    // Book.create() runs Mongoose validation (required, min, enum, etc.)
    // from the schema BEFORE inserting into MongoDB.
    const book = await Book.create(req.body);
    res.status(201).json({ message: 'Book Added Successfully', book });
  } catch (error) {
    // ValidationError (bad price, missing title, etc.) lands here.
    // 400 = "Bad Request" — the client sent something wrong, not us.
    res.status(400).json({ message: error.message });
  }
};

// @route   GET /books
// @desc    Get all books
export const getAllBooks = async (req, res) => {
  try {
    // Book.find({}) with no filter returns every document in the collection.
    const books = await Book.find({});
    res.status(200).json(books);
  } catch (error) {
    // 500 = "Internal Server Error" — something broke on our end
    // (e.g. DB connection dropped), not the client's fault.
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /books/:id
// @desc    Get a single book by its MongoDB _id
export const getBookById = async (req, res) => {
  try {
    // req.params.id comes from the :id placeholder in the route path.
    const book = await Book.findById(req.params.id);

    // findById returns null (not an error) if no document matches —
    // we must check for this explicitly.
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (error) {
    // A malformed id (e.g. "abc" instead of a valid ObjectId) throws
    // a CastError here, not a "not found" — this catches that case.
    res.status(400).json({ message: 'Invalid book ID' });
  }
};


// controllers/bookController.js  (add these below the existing functions)

// @route   PUT /books/:id
// @desc    Update a book (price, stock, description, image, category)
export const updateBook = async (req, res) => {
  try {
    // { new: true } tells Mongoose to return the UPDATED document,
    // not the original pre-update version (that's the default).
    // runValidators: true re-applies schema validation on update —
    // WITHOUT this, Mongoose skips validation on .findByIdAndUpdate()
    // by default, which is a common gotcha.
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json({ message: 'Book Updated Successfully', book });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @route   DELETE /books/:id
// @desc    Delete a book
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json({ message: 'Book Deleted Successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @route   GET /books/search?title=java
// @desc    Search books by title OR author (partial, case-insensitive)
export const searchBooks = async (req, res) => {
  try {
    // req.query holds URL query string params: ?title=java -> { title: 'java' }
    const { title } = req.query;

    // $regex does a partial text match (like SQL's LIKE '%java%').
    // 'i' option makes it case-insensitive, so "Java" matches "java".
    // $or checks title OR author — matching the spec's "Search by
    // Title / Author" requirement with one query.
    const books = await Book.find({
      $or: [
        { title: { $regex: title, $options: 'i' } },
        { author: { $regex: title, $options: 'i' } },
      ],
    });

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /books/category/:category
// @desc    Filter books by category
export const getBooksByCategory = async (req, res) => {
  try {
    // req.params.category comes from the :category URL segment.
    const books = await Book.find({ category: req.params.category });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /books/sort/:order
// @desc    Sort books by price, ascending or descending
export const sortBooks = async (req, res) => {
  try {
    // Mongoose's .sort() takes 1 (ascending) or -1 (descending).
    // We translate the URL's "asc"/"desc" into that numeric form.
    const order = req.params.order === 'desc' ? -1 : 1;
    const books = await Book.find({}).sort({ price: order });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

