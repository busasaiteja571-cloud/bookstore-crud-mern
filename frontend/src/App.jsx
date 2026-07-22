import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home.jsx'; 
import { Books } from './pages/Books.jsx';
import { BookDetails } from './pages/BookDetails.jsx';
import { AddBook } from './pages/AddBook.jsx';
import { UpdateBook } from './pages/UpdateBook.jsx';
import { Navbar } from './components/Navbar.jsx';
import { Cart } from './pages/Cart.jsx';

function App() {
  return (
    <>
      <Navbar />
      {/* Routes acts like a switch statement: it renders the FIRST
          Route whose path matches the current URL. */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        {/* :id here works just like Express's :id — it's a URL
            parameter, readable inside BookDetails via useParams() */}
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/add-book" element={<AddBook />} />
        <Route path="/update-book/:id" element={<UpdateBook />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </>
  );
}

export default App;