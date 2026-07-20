import dns from 'node:dns';

dns.setServers(['1.1.1.1', '8.8.8.8']);
// Import the express library — this is the framework that lets us
// define routes and handle HTTP requests/responses without writing
// raw Node 'http' module boilerplate.
import express from 'express'

// cors lets our future React app (running on a different port,
// e.g. localhost:5173) make requests to this server (localhost:5000)
// without the browser blocking them.
import cors from 'cors';

// dotenv loads variables from a .env file into process.env,
// so secrets (like the MongoDB connection string) never get
// hardcoded into the source code.
import 'dotenv/config';

import connectDB from './config/db.js';
import bookRoutes from './routes/bookRoutes.js';
// Create the Express application instance. This 'app' object
// is what we'll attach routes and middleware to.
const app = express();

// Call the connection function immediately on startup.
connectDB();

// Middleware: runs on EVERY incoming request, in order, before
// it reaches a route handler.
app.use(cors());           // allow cross-origin requests
app.use(express.json());   // parse incoming JSON request bodies into req.body

// A simple test route to confirm the server is alive.
app.get('/', (req, res) => {
  res.send('Book Store API is running');
});

// Every request starting with /books gets forwarded to bookRoutes.
// So router.get('/') above actually handles GET /books.
app.use('/books', bookRoutes);

// Pull the port from .env, fall back to 5000 if not set.
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});