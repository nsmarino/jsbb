import React, { useState, useEffect } from 'react'

import Notification from './components/Notification'
import LoginForm from './components/Login'

import Thread from './components/Thread'

import Post from './components/Post'
import PostForm from './components/PostForm'

import postService from './services/posts'
import loginService from './services/login'  

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null) 
  const [loginVisible, setLoginVisible] = useState(false)
  
  const [posts, setPosts] = useState([])
  const [newPost, setNewPost] = useState('')

  useEffect(() => {
    postService
      .getAll()
      .then(initialPosts => setPosts(initialPosts))
  }, [])

  // retrieve login info from local storage and set user token for note-posting
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      postService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
  
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )       
      postService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  
  // clears user info from local storage and resets user state
  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }



  const postList = () => posts.map(post =>
    <Post
      key={post.id} 
      post={post}
    />
    )

  // function determines whether LoginForm component is visible
  // using a Boolean style on both login button and actual login form
  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>

      </div>
    )
  }

  const handlePostChange = (event) => {
    setNewPost(event.target.value)
  }

  const addPost = (event) => {
    event.preventDefault()

    const postObject = {
      content: newPost,
      date: new Date().toISOString(),
      id: posts.length + 1,
    }
    postService
    .create(postObject)
    .then(data => {
      setPosts(posts.concat(data))
      setNewPost('')
    })
    // document.location.reload()
  }

  // const toggleImportanceOf = id => {
  //   const note = notes.find(n => n.id === id)
  //   const changedNote = { ...note, important: !note.important }

  //   noteService
  //     .update(id, changedNote)
  //     .then(returnedNote => {
  //       setNotes(notes.map(note => note.id !== id ? note : returnedNote))
  //     })
  //     .catch(error => {
  //       setErrorMessage(
  //         `Note '${note.content}' was already removed from server`
  //       )
  //       setTimeout(() => {
  //         setErrorMessage(null)
  //       }, 5000)
  //       setNotes(notes.filter(n => n.id !== id))
  //     })
      
  // }

  return (
    <div>
      <header>
      <h1>jsbb</h1>

      <Notification message={errorMessage} />

      {user === null ?
        loginForm() :
        <div>
        <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
        </div>
      }
      </header>
      <main>
        <div>
          <h2>Test Board</h2>
          <button>new topic</button>
          <Thread />
        </div>
          <h2>Test Thread</h2>
          {postList()}
          <PostForm 
            onSubmit={addPost}
            value={newPost}
            handleChange={handlePostChange}/>
        </main>
    </div>
  )
}

export default App 