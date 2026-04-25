import React, { useState } from 'react'

// It'd be cool to pass some sort of isFirstTimeVisit or isFirstNote prop to this component but I just can't get the logic to fully work in the parent component right now. Future quality of life improvement!
const NewNote = ({ onCreate }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');
  const [isEmptyNoteError, setIsEmptyNoteError] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    if (newText.length === 0) {
      setIsEmptyNoteError(true);
    } else {
      setIsEmptyNoteError(false);
      const noteTitle = newTitle.length === 0 ? 'No title' : newTitle; // This worked!! Nice 🚀
      onCreate(noteTitle, newText);

      setNewText('');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type='text' value={newTitle} onChange={(e) => setNewTitle(e.target.value)}/>
      <textarea value={newText} onChange={(e) => setNewText(e.target.value)}></textarea>
      {/* <p>newText: {newText}</p> */}
      {isEmptyNoteError ? <p className="error-message">Let's not create an empty note, shall we?</p> : <p className="error-message"></p>}
      <input type='submit' value='Create note!' />
    </form >
  )
}

export default NewNote