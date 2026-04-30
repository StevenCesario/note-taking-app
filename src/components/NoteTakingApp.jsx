import { useEffect, useState } from "react";
import './NoteTakingApp.css';
import Note from "./Note";
import NewNoteModal from "./NewNoteModal";
import TrashCanModal from "./TrashCanModal";

const NoteTakingApp = () => {
  const [theme, setTheme] = useState(localStorage.getItem('app_theme') || 'light');
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // REFACTOR! Can be either 'NewNote', 'TrashCan', or null for now (when no modal is open)
  const [currentlyVisibleModal, setCurrentlyVisibleModal] = useState(null);

  // LOAD useEffect
  useEffect(() => {
    // Check localStorage for notes
    let storedNotes = localStorage.getItem('user-notes');
    if (storedNotes !== null) { // 'user-notes' will be an array, yes, but we don't use JSON.parse here, right? Since we're unsure whether we were are getting something out of localStorage to begin with?
      // If found, set the initial state
      // Parse the notes and ensure they don't trigger the "new" animation on load
      const parsedNotes = JSON.parse(storedNotes).map(note => ({ ...note, isNew: false }));
      setNotes(parsedNotes);
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

  // LIGHT/DARK MODE useEffect
  useEffect(() => {
    localStorage.setItem('app_theme', theme);
    document.body.className = theme;
  }, [theme]);

  // Update the parameters to accept color and rotation
  function createNote(title, text, color, rotation) { // isActive does not need to be part of the arguments!
    setNotes([...notes, {
      id: Date.now(),
      title: title,
      text: text,
      isActive: true,
      color: color,         // Use the passed color
      rotation: rotation,   // Use the passed rotation
      isNew: true
    }]);

    // console.log('notes:', notes) // The notes array... is not set at this point?? What?? What am I missing here?
    // if (notes.length === 1) localStorage.setItem('user-notes', JSON.stringify(notes)); // This feels... a bit ugly and wrong but it works for now? It did not work and it is ugly and wrong for a reason haha! Keeping as another artifact

    setCurrentlyVisibleModal(null); // Instead of `setIsNewNoteModalVisible(false);`, this should become... `setCurrentlyVisibleModal(null);`
  }

  function editNote(id, title, text) { // This function does NOT care about isActive :)
    setNotes(notes.map(note => note.id === id ? { ...note, title: title, text: text } : note))
  }

  // This is now completely unknowingly in the past but consciously aware now in the present moment the perma delete function. And we'll create the soft delete function!
  function deleteNote(id) {
    setNotes(notes.filter(note => note.id !== id)); // This is it, isn't it?
  }

  function softDeleteNote(id) {
    setNotes(notes.map(note => note.id === id ? { ...note, isActive: false } : note)); // I believe this is it
  }

  function restoreNote(id) {
    setNotes(notes.map(note => note.id === id ? { ...note, isActive: true } : note)); // And the restore function is literally just the mirror haha!
  }

  // // It feels like we can refactor these two modal toggle functions into one? Future refactor. They *might* still be able to be mashed together haha! With some sort of argument
  // function handleNewNoteModalToggle() {
  //   setCurrentlyVisibleModal('NewNote');
  // }

  // function handleTrashCanModalToggle() {
  //   setCurrentlyVisibleModal('TrashCan');
  // }

  // Shamelessly taking the function that my React coach gave me haha
  function openModal(modalName) {
    setCurrentlyVisibleModal(modalName);
  }

  // The problem now... is onClose and onCancel, which earlier called upon these. We can't close the modals now
  function closeModal() {
    setCurrentlyVisibleModal(null);
  } // This feels... kinda like an ugly solution? But it works and I'm okay with it for v1 without googling or using AI

  function handleThemeToggle() {
    theme === 'light' ? setTheme('dark') : setTheme('light');
  }

  if (isLoading) return <p>App is loading...</p>

  // I'm removing the {notes.length === 0 ? conditional rendering, we're gonna do a whole bunch of conditional rendering for the user's
  // first time visit instead, it's gonna be rad :)
  return (
    <>
      <div className="main-container">
        <h1>StickyNote</h1>
        <div className="notes-grid">
          {notes.filter(note => note.isActive === true).map(note => <Note key={note.id} note={note} onEdit={editNote} onSoftDelete={softDeleteNote} />)}
          <span className="new-note-plus" onClick={() => openModal('NewNote')}>+</span>
        </div>
        {currentlyVisibleModal === 'NewNote' && (
          <div className="modal-overlay">
            <NewNoteModal onCreate={createNote} onCancel={closeModal} />
          </div>
        )}
        {currentlyVisibleModal === 'TrashCan' && (
          <div className="modal-overlay">
            <TrashCanModal notes={notes} onClose={closeModal} onRestore={restoreNote} onPermaDelete={deleteNote} />
          </div>
        )}
      </div>
      <button className="floating-theme-btn" onClick={handleThemeToggle} aria-label="Switch between Ligth Mode and Dark Mode">
        {theme === 'light' ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        )}
      </button>
      <button className="floating-trash-btn" onClick={() => openModal('TrashCan')} aria-label="Open Trash">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
        </svg>
      </button>
    </>
  )
}

export default NoteTakingApp