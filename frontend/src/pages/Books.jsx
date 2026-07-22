import { useState, useEffect} from "react";
import { getAllBooks,searchBooks,getBooksByCategory,sortBooks, deleteBookById } from "../services/bookService";
import { BookCard } from "../components/BookCard";
import ConfirmDialog from "../components/ConfirmDialog";
import { Link } from "react-router-dom";
import './Books.css'

export const Books = () => {

    //books: holds the array of book objects once fetched.
    //Starts as an empty array (not undefined) so .map() below
    //never crashes on the very first render, before data arrieves.

    const [books, setBooks] = useState([]);

    //loading: tracks whether the fetch is still in-flight, so we 
    //can show a "Loading.." message insted of blank/empty page.
    const [loading, setLoading] = useState(false);

    //error: holds an errror message if the fetch fails, so the UI 
    //can show something usefull insted of ilently failing.
    const [error, setError] = useState(null);

    // Separate state for each control — this is what the UI elements bind to.
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All');
    const [sortOrder, setSortOrder] = useState('');

    // Holds the book PENDING deletion (or null if no dialog is open).
    // Storing the whole book (not just an id) lets the dialog message
    // reference its title directly, e.g. "Delete 'Java Programming'?"
  const [bookToDelete, setBookToDelete] = useState(null); 


    //UseEffect runs AFTER the component render. The empty dependency
    //array [] means "run this only once, right after the first render"
    //-equivalent to componentDidMount in older class-based React.

    useEffect(() => {
        //We define an async function INSIDE useEffect rather than making
        //the effect callback itself async, because useEffect's callback
        //must return either nothing or a cleanup function - never a Promise.

        const fetchBook = async () => {
            try{
                setLoading(true);
                setError(null); // Clear previous errors on new fetch attempt
                let response;
                //Priority: search > sort > category > default all.
                //(your spec treats these as independent endpoints rather thang
                //combinable fillters, so we can pick ONE based on what's active.)
                if(searchTerm){
                    response = await searchBooks(searchTerm);
                }else if(sortOrder){
                    response = await sortBooks(sortOrder);
                }else if(category !== 'All'){
                    response = await getBooksByCategory(category);
                }else{
                    response= await getAllBooks();
                }
                
                setBooks(response.data);
            } catch(error){
                setError('Failed to load books. Is the backend erver running?')
            } finally{
                // finally guarantees loading flips to false whether the
                // request succeeded or failed.
                setLoading(false);
            }
        };
        fetchBook();
        //This effect now depends on searchTerm, category,and sortOrder -
        //it returns the fetch whenver ANY of these change , giving us
        //"instant" search/filter/sort as the spec requires.

    },[searchTerm,category,sortOrder])   // <-- empty array = run once on mount, not on every re-render

    //Step 1: clicking "Delete" on a Card doen't delete anything yet -
    //it just opens the confirmation dialog by setting bookToDelete.

    const handleDeleteClick = (book) =>{
        console.log("Delete clicked for book:", book);
        setBookToDelete(book);
    }
    //step 2 : only THIS function actually call the DELETE endpoint
    // and it only run when the user clicks "yes ], delete" in the dialiog.

    const confirmDelete = async () => {
        try {
            setError(null);
            await deleteBookById(bookToDelete._id);
            //Remove the deleted book from local state immediately, so the
            //UI updates instantly without waiting for a full re-fetch.
            setBooks((prev) => prev.filter((b) => b._id !== bookToDelete._id));
        }catch(err){
            setError('Failed to deleted book...');
        }finally{
            setBookToDelete(null);
        }
    };
    const cancelDelete  = () => setBookToDelete(null);
  return (
        <div className="books-container">
            <h1>All Books</h1>
            <div className="controls">
                <input
                    type="text"
                    placeholder="Search by title or author..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="All">All Categories</option>
                    <option value="Programming">Programming</option>
                    <option value="Database">Database</option>
                    <option value="AI">AI</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Kids">Kids</option>
                    <option value="History">History</option>
                </select>
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="">Default</option>
                    <option value="asc">Price: Low to High</option>
                    <option value="desc">Price: High to Low</option>
                </select>
            </div>
            
            {loading && <p className="loading-text">Loading books...</p>}
            {error && <p className="error-text">{error}</p>}

            <div className="book-grid">
                {books.map((book) => (
                    <div key={book._id} className="book-card-wrapper">

                        <BookCard book={book} />
                         <Link to={`/update-book/${book._id}`} className="update-btn">Update</Link>
                        <button onClick={() => handleDeleteClick(book)}>Delete</button>
                    </div>
                ))}
            </div>

            {/* Conditional render: the modal dialog only exists when bookToDelete is truthy */}
            {bookToDelete && (
                <ConfirmDialog
                    message={`Are you sure you want to delete "${bookToDelete.title}"?`}
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
        </div>
    );
};