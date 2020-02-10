import React from 'react'

const Post = ({post}) => {
    return (
      <div>
        <div>{post.user}</div>
        <div className="postBody">
        <p>{post.content}</p>
        <p>{post.date}</p>
        <button onClick={()=>console.log('hello')}>edit</button>
        </div>
        <br></br>
      </div>
    )
  }

export default Post