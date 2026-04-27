import { useState } from 'react'
import './Note.css';

const Note = ({ note, onEdit, onSoftDelete, onRestore, onPermaDelete }) => {
  const [isEditable, setIsEditable] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note.title);
  const [editedText, setEditedText] = useState(note.text);

  // NEW: State to track the crumple animation
  const [isTrashing, setIsTrashing] = useState(false);

  // NEW: State to hold our dynamic throw coordinates
  const [throwCoordinates, setThrowCoordinates] = useState({ x: 0, y: 0 });

  // NEW: Calculate the exact trajectory!
  function handleTrashClick(e) {
    // 1. Get the GPS coordinates of the specific note we clicked
    // e.currentTarget is the button, so we look at its parent (the note div)
    const noteRect = e.currentTarget.closest('.note').getBoundingClientRect();
    
    // 2. Get the GPS coordinates of the Trash Can button
    const trashBtn = document.querySelector('.floating-trash-btn');
    const trashRect = trashBtn.getBoundingClientRect();

    // 3. Calculate the difference in pixels
    // We add a little offset so it aims for the center of the trash can, not the top-left edge
    const travelX = trashRect.left - noteRect.left + 20; 
    const travelY = trashRect.top - noteRect.top + 20;

    // 4. Save coordinates and trigger the animation
    setThrowCoordinates({ x: travelX, y: travelY });
    setIsTrashing(true); 
    
    setTimeout(() => {
      onSoftDelete(note.id);
    }, 650); 
  }

  // useEffect(() => {
  //   // A useEffect to sync editedText with text?? Maybe?
  //   // NO. No, no, no, onEdit is a remote controller up to the PARENT that uses the editedText and edits the MAIN STATE. Right
  //   // And onEdit should not be on the onClick for the Edit button, it's on the Save button!
  //   // Or perhaps even better, none of them? A handleSave function here that uses onEdit?
  // }, [editedText]);

  // useEffect(() => {
  //   setEditedText(note.text);
  // }, []) // Is this in an illegal use of useEffect haha? It works in combination with the sneaky value use in the textarea!
  // Leaving this as an artifact, wearing my mistakes on my sleeve :)
  // This is the sneaky value attribute in question: `value={isEditable ? editedText : note.text}`

  function handleSave() {
    // Use onEdit
    onEdit(note.id, editedTitle, editedText) // Switch to note as the prop so that we easily can use note.id here. Which in turn forces us to use note.text in the render

    // Handle the isEditable state
    setIsEditable(false);
  }

  // The !isEditable is a bit of a brain bender but I do understand it haha, the logic checks out!
  return (
    <div 
      className={`note ${note.isNew ? 'animate-in' : ''} ${isTrashing ? 'animate-out' : ''}`} 
      style={{ 
        backgroundColor: note.color, 
        '--rotation': `${note.rotation}deg`,
        // NEW: Pass the dynamic coordinates to CSS!
        '--fly-x': `${throwCoordinates.x}px`,
        '--fly-y': `${throwCoordinates.y}px`
      }}
    >
      <input type='text' disabled={!isEditable} value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} />
      <textarea disabled={!isEditable} value={editedText} onChange={(e) => setEditedText(e.target.value)} />
      <br />
      {note.isActive && (
        <>
          {isEditable ? <button onClick={handleSave}>Save</button> : <button onClick={() => setIsEditable(true)}>Edit</button>}
          {/* <p>isActive: {note.isActive ? 'True' : 'False'}</p> We can't "print a boolean", we gotta *use* the boolean haha. This works!! */}
          {/* Use the new delay function instead of directly calling onSoftDelete */}
          <button onClick={handleTrashClick}>Trash</button>
        </>
      )}

      {!note.isActive && (
        <>
          <button onClick={() => onRestore(note.id)}>Restore</button>
          <button onClick={() => onPermaDelete(note.id)}>Permanently delete</button>
        </>
      )}
    </div>
  )
}

export default Note