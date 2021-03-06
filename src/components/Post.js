import React from 'react'
import gavrilo from './gavrilo.jpg'

const Post = ({post, deletePost}) => {
    return (
      <div className="post">

        <div className="userInfo">
          <img src={gavrilo} width="100px" alt="avatar"/>
          <h3>{post.user.username}</h3>
        </div>

        <div className="postBody">
        <p className="postHeader">by {post.user.username} on {post.date}</p>
        <p>{post.content}</p>
        <button onClick={()=>console.log('this will edit posts once implemented')}>edit</button>
        <button onClick={deletePost}>delete</button>
        </div>
      </div>
    )
  }

export default Post