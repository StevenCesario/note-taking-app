import { useState, useEffect } from 'react';
import './NewNoteModal.css';

// It'd be cool to pass some sort of isFirstTimeVisit or isFirstNote prop to this component but I just can't get the logic to fully work in the parent component right now. Future quality of life improvement!
const NewNoteModal = ({ onCreate, onCancel }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');
  const [isEmptyNoteError, setIsEmptyNoteError] = useState(false);

  // NEW: Store the draft's random properties
  const [draftColor, setDraftColor] = useState('');
  const [draftRotation, setDraftRotation] = useState(0);

  // NEW: Generate them once when the modal opens
  useEffect(() => {
    const stickyColors = ['#fef08a', '#fbcfe8', '#bbf7d0', '#bfdbfe', '#e9d5ff'];
    setDraftColor(stickyColors[Math.floor(Math.random() * stickyColors.length)]);
    setDraftRotation(Math.random() * 6 - 3);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    if (newText.length === 0) {
      setIsEmptyNoteError(true);
    } else {
      setIsEmptyNoteError(false);
      const noteTitle = newTitle.length === 0 ? 'No title' : newTitle; // This worked!! Nice 🚀
      
      // NEW: Pass the color and rotation to the parent!
      onCreate(noteTitle, newText, draftColor, draftRotation);

      setNewText('');
    }
  }

  return (
    <form 
      onSubmit={handleSubmit}
      className="draft-sticky-note" 
      style={{ 
        backgroundColor: draftColor, 
        '--rotation': `${draftRotation}deg` 
      }}
    >
      <input type='text' placeholder='Title' value={newTitle} onChange={(e) => setNewTitle(e.target.value)}/>
      <textarea value={newText} onChange={(e) => setNewText(e.target.value)}></textarea>
      {/* <p>newText: {newText}</p> */}
      {isEmptyNoteError ? <p className="error-message">Let's not create an empty note, shall we?</p> : <p className="error-message"></p>}
      {/* We can hide the button text and just let it say "Create note!" to feel more like a physical action */}
      <input type='submit' value='Create note!' />
      <button type='button' onClick={onCancel}>✕</button>
    </form >
  )
}

export default NewNoteModal