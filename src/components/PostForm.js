import React from 'react'

const PostForm = ({ onSubmit, handleChange, value}) => {
  return (
    <div>
      <form onSubmit={onSubmit}>
        <textarea rows="5" cols="60"
          value={value}
          onChange={handleChange}
        />
        <br/>
        <button type="submit">Post Reply</button>
      </form>
    </div>
  )
}

export default PostForm