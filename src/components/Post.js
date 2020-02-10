import React from 'react'
import gavrilo from './gavrilo.jpg'

const Post = ({post}) => {
    return (
      <div className="post">

        <div className="userInfo">
          <img src={gavrilo} width="100px" alt="avatar"/>
          <h3>{post.user.username}</h3>
        </div>

        <div className="postBody">
        <p className="postHeader">by {post.user.username} on {post.date}</p>
        <p>{post.content}</p>
        <button onClick={()=>console.log('hello')}>edit</button>
        </div>
      </div>
    )
  }

export default Post