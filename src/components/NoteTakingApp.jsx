import { useEffect, useState } from "react"
import Note from "./Note"
import NewNote from "./NewNote";

const NoteTakingApp = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    // Check localStorage for notes
  }, [])

  function createNote(text) {
    setNotes([...notes, { id: Date.now(), text: text }]);
  }

  function editNote(id, text) {
    setNotes(notes.map(note => note.id === id ? {...note, text: text} : note))
  }

  return (
    <div className="main-container">
      <h1>Note Taking App</h1>
      {notes.map(note => <Note key={note.id} note={note} onEdit={editNote} />)}
      {notes.length === 0 ? (
        <>
          <h2>Create your first note below!</h2>
          <NewNote onCreate={createNote} />
        </>) : (
        <>
        
        </>
      )}
    </div>
  )
}

export default NoteTakingApp