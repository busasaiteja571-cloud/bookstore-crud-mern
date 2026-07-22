# 📚 ABC Book Store — MERN Stack Online Book Store

A full-stack online book store built with **MongoDB, Express.js, React, and Node.js (MERN)**. Supports browsing, searching, filtering, and sorting books, a shopping cart, and full admin CRUD for book management.

---

## 🚀 Live Demo

- **Frontend:** https://bookstore-crud-mern-oszn.vercel.app
- **Backend API:** https://bookstore-crud-mern.vercel.app

---

## ✨ Features

- Browse all books in a responsive card grid
- View detailed information for a single book
- Instant search by title or author
- Filter books by category (Programming, Database, AI, Fiction, Kids, History)
- Sort books by price (low → high / high → low)
- Add books to a cart with quantity tracking and a running total
- Admin: Add, Update, and Delete books (with a confirmation dialog before deleting)
- Client-side and server-side form validation
- Fully responsive layout

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Axios, Context API |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Deployment | Vercel (frontend), Vercel (backend) |

---

## 📁 Project Structure

```
book-store/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   └── bookController.js     # CRUD + search/filter/sort logic
│   ├── models/
│   │   └── Book.js                # Mongoose schema
│   ├── routes/
│   │   └── bookRoutes.js          # API route definitions
│   ├── .env                        # Environment variables (not committed)
│   ├── .gitignore
│   ├── package.json
│   └── server.js                   # Express app entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── BookCard.jsx
    │   │   ├── BookForm.jsx
    │   │   ├── ConfirmDialog.jsx
    │   │   └── Navbar.jsx
    │   ├── context/
    │   │   └── CartContext.jsx     # Global cart state
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Books.jsx
    │   │   ├── BookDetails.jsx
    │   │   ├── AddBook.jsx
    │   │   ├── UpdateBook.jsx
    │   │   └── Cart.jsx
    │   ├── services/
    │   │   ├── axios.js              # Axios instance
    │   │   └── bookService.js       # API call functions
    │   ├── App.jsx                   # Route definitions
    │   ├── index.css                 # Global styles
    │   └── main.jsx                   # App entry point
    ├── .gitignore
    └── package.json
```

---

## ⚙️ Getting Started (Local Development)

### Prerequisites

- Node.js (v18+)
- A MongoDB Atlas account (free tier is enough)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/book-store.git
cd book-store
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
FRONTEND_URL=http://localhost:5173
```

Run the server:

```bash
npm run dev
```

Backend runs at `http://localhost:5000`.

### 3. Frontend setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in `frontend/`:

```
VITE_API_URL=http://localhost:5000
```

Run the frontend:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`.

---

## 📡 API Endpoints

Base URL: `/books`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/books` | Add a new book |
| GET | `/books` | Get all books |
| GET | `/books/:id` | Get a single book by ID |
| PUT | `/books/:id` | Update a book |
| DELETE | `/books/:id` | Delete a book |
| GET | `/books/search?title=` | Search books by title or author |
| GET | `/books/category/:category` | Filter books by category |
| GET | `/books/sort/:order` | Sort books by price (`asc` / `desc`) |

### Example: Add a Book

**Request**

```
POST /books
Content-Type: application/json

{
  "title": "Java Programming",
  "author": "James Gosling",
  "price": 650,
  "category": "Programming",
  "stock": 25,
  "description": "Complete Java programming guide.",
  "image": "java.jpg"
}
```

**Response**

```json
{
  "message": "Book Added Successfully",
  "book": { "...": "..." }
}
```

---

## 🧩 Book Schema

| Field | Type | Validation |
|---|---|---|
| title | String | Required |
| author | String | Required |
| price | Number | Greater than 0 |
| category | String | Required, one of the fixed categories |
| stock | Number | Cannot be negative |
| description | String | Minimum 20 characters |
| image | String (URL) | Optional |

---

## 🌐 Deployment

- **Backend** is deployed on [Vercel](https://vercel.com) as a Serverless Function, with `MONGO_URI` and `FRONTEND_URL` set as environment variables in the dashboard.
- **Frontend** is deployed on [Vercel](https://vercel.com), with `VITE_API_URL` set to the deployed backend URL as a build-time environment variable.
- **Database** is hosted on [MongoDB Atlas](https://www.mongodb.com/atlas), shared by both local development and production.

---

## 🔮 Possible Next Steps

- Admin authentication (JWT) to restrict Add/Update/Delete access
- Pagination for the book listing page
- Toast notifications instead of inline success/error text
- Order history / checkout flow beyond the cart

---

## 📄 License

This project was built for educational purposes as part of a MERN stack learning exercise.