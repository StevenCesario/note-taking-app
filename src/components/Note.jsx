import { useState } from 'react'
import './Note.css';

const Note = ({ note, onEdit, onSoftDelete, onRestore, onPermaDelete }) => {
  const [isEditable, setIsEditable] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note.title);
  const [editedText, setEditedText] = useState(note.text);

  // A palette of classic pastel sticky note colors
  const stickyColors = ['#fef08a', '#d73490', '#bbf7d0', '#5480b7', '#e9d5ff'];

  // Memoize the random properties so they stick!
  const randomColor = useMemo(() => stickyColors[Math.floor(Math.random() * stickyColors.length)], []);
  const randomRotation = useMemo(() => Math.random() * 6 - 3, []); // Random tilt between -3 and 3 degrees

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
      className='note'
      style={{
        backgroundColor: randomColor,
        '--rotation': `${randomRotation}deg` // Passing rotation to CSS via custom variable!
      }}
    >
      <input type='text' disabled={!isEditable} value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} />
      <textarea disabled={!isEditable} value={editedText} onChange={(e) => setEditedText(e.target.value)} />
      <br />
      {note.isActive && (
        <>
          {isEditable ? <button onClick={handleSave}>Save</button> : <button onClick={() => setIsEditable(true)}>Edit</button>}
          {/* <p>isActive: {note.isActive ? 'True' : 'False'}</p> We can't "print a boolean", we gotta *use* the boolean haha. This works!! */}
          <button onClick={() => onSoftDelete(note.id)}>Trash</button>
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