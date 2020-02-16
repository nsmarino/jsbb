import React from 'react'

const ThreadForm = ({ onSubmit, handleTitleChange, handleOPChange, titleValue, value}) => {
  return (
    <div>
      <form onSubmit={onSubmit}>
        Topic <input type="text" onChange={handleTitleChange} value={titleValue}/>
        <br></br>
        <textarea rows="3" cols="60"
          value={value}
          onChange={handleOPChange}
        />
        <br/>
        <button type="submit">Post Topic</button>
      </form>
    </div>
  )
}

export default ThreadForm