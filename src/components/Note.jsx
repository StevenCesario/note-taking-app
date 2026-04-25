import React from 'react'

const Note = ({ text }) => {
  return (
    <textarea disabled>
      {text}
    </textarea>
  )
}

export default Note