import React from 'react'
import Note from './Note'

const TrashCanModal = ({ notes, onClose }) => {
  return (
    <div className='trash-can-container'>
      <div className="notes-grid">
        {/* {notes.map(note => <Note key={note.id} note={note} onEdit={editNote} onDelete={deleteNote} />)} What goes here? I believe I need to extend the Note props */}
        {/* It also just clicked here; I believe we're gonna FIRSTS filter based on isActive and THEN map the NEW array to use the Note component? */}
      </div>
      <button type='button' onClick={onClose}>Close</button>
    </div>
  )
}

export default TrashCanModal