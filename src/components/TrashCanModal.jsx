import React from 'react'
import Note from './Note'

const TrashCanModal = ({ notes, onClose, onRestore, onPermaDelete }) => {
  return (
    <div className='trash-can-container'>
      <div className="notes-grid">
        {/* {notes.map(note => <Note key={note.id} note={note} onEdit={editNote} onDelete={deleteNote} />)} What goes here? I believe I need to extend the Note props */}
        {/* It also just clicked here; I believe we're gonna FIRSTS filter based on isActive and THEN map the NEW array to use the Note component? */}
        {/* NOW  with 1. the isActive boolean implemented across the system and 2. the functions for onRestore and onPermaDelete created, we SHOULD be able to do... */}
        {/* For the filtering, we want a new filtered array where isActive is... false */}
        {notes.filter(note => note.isActive === false).map(note => <Note note={note} onRestore={onRestore} onPermaDelete={onPermaDelete} />)}
        {/* Will this chained expression work???????? */}
        {/* IT DOES! But the "trashed" note is still visible in the active view haha, we need to filter there for isActive to be true */}
      </div>
      <button type='button' onClick={onClose}>Close</button>
      {/* Future TODO: Let the esc keyboard button act as an onClose too! */}
    </div>
  )
}

export default TrashCanModal