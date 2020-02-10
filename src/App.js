import React, { useState, useEffect } from 'react'

import Note from './components/Note'
import Notification from './components/Notification'
import LoginForm from './components/Login'
import Togglable from './components/Togglable'
import NoteForm from './components/NoteForm'

import Post from './components/Post'
import PostForm from './components/PostForm'

import postService from './services/posts'
import noteService from './services/notes'
import loginService from './services/login'  

const App = () => {

  // stateful variables
  const [notes, setNotes] = useState([]) 
  const [newNote, setNewNote] = useState('') 
  const [showAll, setShowAll] = useState(true)

  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null) 
  const [loginVisible, setLoginVisible] = useState(false)
  
  const [posts, setPosts] = useState([])
  const [newPost, setNewPost] = useState('')


  // populate notelist with effect hook and axios GET
  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => setNotes(initialNotes))
  }, [])

  // retrieve login info from local storage and set user token for note-posting
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])


  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  // sends input from login via axios POST,
  // checks against user database, and returns
  // state updates and sets token
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )       
      noteService.setToken(user.token)
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

  // formats notes array into DOM elements
  const rows = () => notesToShow.map(note =>
    <Note
      key={note.id}
      note={note}
      toggleImportance={() => toggleImportanceOf(note.id)}
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

  // this Reference is used to access state of a child component from
  // functions within the App component. the Reference is passed to the
  // subcomponent we want to affect - the Togglable
  const noteFormRef = React.createRef()

  // this noteform function uses the togglable component as a wrapper
  // around the NoteForm child component. this is an easy way to add toggle
  const noteForm = () => (
    <Togglable buttonLabel="new note" ref={noteFormRef}>
    <NoteForm
        onSubmit={addNote}
        value={newNote}
        handleChange={handleNoteChange}
      />
    </Togglable>
  )

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }
  
  const handlePostChange = (event) => {
    setNewPost(event.target.value)
  }

  const addPost = (event) => {
    event.preventDefault()
    console.log('new post')
    setNewPost('')
  }
  const addNote = (event) => {
    event.preventDefault()

    // IMPORTANT : here we see a function in App calling a function from
    // the Togglable component. It does so by referring to the noteFormRef,
    // which has the methods of the Togglable component stored
    // in the 'current' property
    noteFormRef.current.toggleVisibility()

    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() > 0.5,
      id: notes.length + 1,
    }

    noteService
      .create(noteObject)
      .then(data => {
        setNotes(notes.concat(data))
        setNewNote('')
      })
  }

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
      
  }

  return (
    <div>
      <h1>jsbb</h1>

      <Notification message={errorMessage} />

      {user === null ?
        loginForm() :
        <div>
        <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
        {noteForm()}
        </div>
      }

      {/* <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {rows()}
      </ul> */}
      <div>
          <h2>post demo</h2>
          <Post post={ {user: 'henry', content: 'hello', date: '4/12/11'} }/>
          <PostForm 
            onSubmit={addPost}
            value={newPost}
            handleChange={handlePostChange}/>
        </div>
    </div>
  )
}

export default App 