import React, { useState } from 'react'

const NewNote = ({ onCreate }) => {
  const [newText, setNewText] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onCreate(newText);
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={newText} onChange={(e) => setNewText(e.target.value)}></textarea>
      {/* <p>newText: {newText}</p> */}
      <br />
      <input type='submit' value='Create my first note!' />
    </form >
  )
}

export default NewNote