import './ConfirmDialog.css'
// A generic confirmation modal — reusable for delete, or any other
// "are you sure?" moment later in the app, not hardcoded to books.
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    // A simple overlay; clicking the backdrop cancels, same as most
    // modal UX conventions (Escape-hatch without hunting for a button).
    <div className="dialog-backdrop" onClick={onCancel}>
      {/* stopPropagation prevents a click INSIDE the box from bubbling
          up to the backdrop's onClick and accidentally cancelling. */}
      <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
        <p>{message}</p>
        <button onClick={onConfirm}>Yes, delete</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
export default ConfirmDialog;