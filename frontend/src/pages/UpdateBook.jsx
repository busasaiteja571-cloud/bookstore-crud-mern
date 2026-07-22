import { useNavigate, useParams } from "react-router-dom";
import BookForm from "../components/BookForm";
import { getBookById, updateBookById } from "../services/bookService";
import { use, useEffect, useState } from "react";
export const UpdateBook = () => {

  //useParam reads the :id from the current URL- this page is 
  //mounted at /update-book/:id (defined back in Phase 5's App.jsx).

  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading,setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [serverError, setServerError] = useState('');

  //Fetch the exiting book ONCE when this page mount, so BookForm
  //Can be pre-filled - matches spec: "Fetch existing data into the form."
  useEffect(()=>{
    const fetchBook = async () => {
      try{
        const response = await getBookById(id);
        setBook(response.data);
      }catch(err){
        setServerError('Could not load book');
      }finally{
        setLoading(false);
      }
    };
    fetchBook();
  },[id]); // returns if the :id in the URL ever changes

  const handleUpdate = async (bookData)=>{
    try{
      await updateBookById(id,bookData);
      setMessage('Book Updated Sucessfully');
      setTimeout(() => navigate('/books'),1000);
    }catch(error){
      setServerError(err.response?.data?.message || 'Failed to update book');

    };
    if(loading) return <p>Loading...</p>
    if(!book) return <p>Book not Found</p>
  }
  return (
    <div>
      <div>Update Book</div>
      {message && <p className="success">{message}</p>}
      {serverError && <p className="error">{serverError}</p>}
      <BookForm initialData={book} onSubmit={handleUpdate} submitLabel="Update"/>
    </div>
    
  )
}
