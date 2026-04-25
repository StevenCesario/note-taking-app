import { useEffect, useState } from "react"
import Note from "./Note"
import NewNote from "./NewNote";

const NoteTakingApp = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // LOAD useEffect
  useEffect(() => {
    // Check localStorage for notes
    let storedNotes = localStorage.getItem('user-notes');
    if (storedNotes !== null) { // 'user-notes' will be an array, yes, but we don't use JSON.parse here, right? Since we're unsure whether we were are getting something out of localStorage to begin with?
      // If found, set the initial state
      // console.log(localStorage.getItem('user-notes'))
      setNotes(JSON.parse(storedNotes)); // HERE we use JSON.parse! This would make sense
    }

    // At this point, we have either:
    // * Confirmed that there is no notes stored in localStorage
    // * OR retrieved them from localStorage
    // NOW we can set isLoading to false. The initial load and mount of the app is done!
    setIsLoading(false);
  }, [])

  // SAVE useEffect
  // A second useEffect to listen to changes in the notes state array. We don't bake localStorage sync into the create and edit notes functions. That feels intuitvely wrong
  useEffect(() => {
    // AHH!! The lesson that I learned yesterday! Check the inital use case! A useEffect will ALWAYS fire on mount!
    if (isLoading) return // If the app is loading, return early

    localStorage.setItem('user-notes', JSON.stringify(notes));
  }, [notes, isLoading])

  function createNote(text) {
    setNotes([...notes, { id: Date.now(), text: text }]); // This line is correct, isn't it?
    // console.log('notes:', notes) // The notes array... is not set at this point?? What?? What am I missing here?

    // if (notes.length === 1) localStorage.setItem('user-notes', JSON.stringify(notes)); // This feels... a bit ugly and wrong but it works for now? It did not work and it is ugly and wrong for a reason haha! Keeping as another artifact
  }

  function editNote(id, text) {
    setNotes(notes.map(note => note.id === id ? {...note, text: text} : note))
  }

  if (isLoading) return <p>App is loading...</p>

  return (
    <div className="main-container">
      <h1>Note Taking App</h1>
      {notes.length === 0 ? (
        <>
          <h2>Create your first note below!</h2>
          <NewNote onCreate={createNote} />
        </>) : (
        <>
          {notes.map(note => <Note key={note.id} note={note} onEdit={editNote} />)}
        </>
      )}
    </div>
  )
}

export default NoteTakingApp