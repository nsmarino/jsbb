import React from 'react'
import PostForm from './PostForm'
import Post from './Post'

const Thread = ({thread, deletePost, addPost, newPost, handlePostChange}) => {

  const showPosts = (posts) => posts.map(post => <Post key={post.id} post={post} deletePost={() => deletePost(post)} />)

    return (
      <div className="thread">
        <h2>{thread.title}</h2>
        {showPosts(thread.posts)}
        <PostForm
          onSubmit={addPost}
          value={newPost}
          handleChange={handlePostChange}
        />
      </div>
    )
  }

export default Thread