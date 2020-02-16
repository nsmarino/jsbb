import React, { useState, useEffect } from 'react'

import Notification from './components/Notification'
import LoginForm from './components/Login'

import Thread from './components/Thread'
import ThreadForm from './components/ThreadForm'
import ThreadLink from './components/ThreadLink'

import Post from './components/Post'
import PostForm from './components/PostForm'

import postService from './services/posts'
import loginService from './services/login' 

import Togglable from './components/Togglable'

const sampleThread = {
  posts: [
    {
    content: "this is the story",
    date: "Sun Feb 16 2020 09:35:14 GMT-0500 (Eastern Standard Time)",
    id: "5e49532260868925fc3043d6",
    user: {
      username: "juice",
      name: "spontaneous",
      id: "5e418ba056c2bf1c98e0887f"
      }
    },
    {
    content: "of me, and my life",
    date: "Sun Feb 16 2020 11:49:21 GMT-0500 (Eastern Standard Time)",
    id: "5e4972914312fc3ecc0cb618",
    user: {
      username: "juice",
      name: "spontaneous",
      id: "5e418ba056c2bf1c98e0887f"
      }
    }
  ],
  title: 'sample thread',
  date: "Sun Feb 16 2020 09:35:14 GMT-0500 (Eastern Standard Time)",
  user: {
    username: "juice",
    id: "5e418ba056c2bf1c98e0887f"
  },
  id: 1
}

const sampleThreadArray = [
  {
    posts: [
      {
      content: "this is the story",
      date: "Sun Feb 16 2020 09:35:14 GMT-0500 (Eastern Standard Time)",
      id: "5e49532260868925fc3043d6",
      user: {
        username: "juice",
        name: "spontaneous",
        id: "5e418ba056c2bf1c98e0887f"
        }
      },
      {
      content: "of me, and my life",
      date: "Sun Feb 16 2020 11:49:21 GMT-0500 (Eastern Standard Time)",
      id: "5e4972914312fc3ecc0cb618",
      user: {
        username: "juice",
        name: "spontaneous",
        id: "5e418ba056c2bf1c98e0887f"
        }
      }
    ],
    title: 'sample thread',
    date: "Sun Feb 16 2020 09:35:14 GMT-0500 (Eastern Standard Time)",
    user: {
      username: "juice",
      id: "5e418ba056c2bf1c98e0887f"
    },
    id: 1
  },
  {
    posts: [
      {
      content: "how are you today",
      date: "Sun Feb 16 2020 09:35:14 GMT-0500 (Eastern Standard Time)",
      id: "5e49532260868925fc3043d6",
      user: {
        username: "juice",
        name: "spontaneous",
        id: "5e418ba056c2bf1c98e0887f"
        }
      },
      {
      content: "i saw your friend's band play",
      date: "Sun Feb 16 2020 11:49:21 GMT-0500 (Eastern Standard Time)",
      id: "5e4972914312fc3ecc0cb618",
      user: {
        username: "juice",
        name: "spontaneous",
        id: "5e418ba056c2bf1c98e0887f"
        }
      }
    ],
    title: 'alex g thread',
    date: "Sun Feb 16 2020 09:35:14 GMT-0500 (Eastern Standard Time)",
    user: {
      username: "juice",
      id: "5e418ba056c2bf1c98e0887f"
    },
    id: 2
  }
]

const App = () => {
//// STATE
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null) 
  const [loginVisible, setLoginVisible] = useState(false)
  const [posts, setPosts] = useState([])
  const [newPost, setNewPost] = useState('')
  
  const [threads, setThreads] = useState(sampleThreadArray)
  const [selectedThread, setSelectedThread] = useState(sampleThread)
  const [newThreadTitle, setNewThreadTitle] = useState('')
  const [newThreadOP, setNewThreadOP] = useState('')

//// EFFECT HOOKS
  useEffect(() => {
    postService
      .getAll()
      .then(initialPosts => setPosts(initialPosts))
  }, [])
  // retrieve login info from local storage and set user token for posting
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      postService.setToken(user.token)
    }
  }, [])

//// USER ADMIN FUNCTIONS
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
  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }
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

//// POST FUNCTIONS
  const postList = () => posts.map(post => <Post key={post.id} post={post} deletePost={() => deletePost(post)} />)
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
  }
  const deletePost = (post) => {
    if (window.confirm(`Ok to remove post?`)) { 
      postService
      .remove(post.id)
      .then(postService.getAll)
      .then(res => setPosts(res))
      .catch(error => {
        setErrorMessage(
          `post cannot be removed - ${error.message}`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
    }
  }

//// THREAD FUNCTIONS
  const threadList = () => threads.map(thread => <ThreadLink key={thread.id} title={thread.title} />)

  const threadFormRef = React.createRef()
  const showThreadForm = () => (
    <Togglable buttonLabel="new thread" ref={threadFormRef}>
    <ThreadForm
        onSubmit={addThread}
        titleValue={newThreadTitle}
        value={newThreadOP}
        handleTitleChange={handleTitleChange}
        handleOPChange={handleOPChange}
      />
    </Togglable>
  )
  const handleTitleChange = (event) => {
    setNewThreadTitle(event.target.value)
    console.log(newThreadTitle)
  }
  const handleOPChange = (event) => {
    setNewThreadOP(event.target.value)
    console.log(newThreadOP)
  }
  const addThread = (event) => {
    event.preventDefault()
    console.log(newThreadTitle, newThreadOP)
    setNewThreadTitle('')
    setNewThreadOP('')
  }
  
  const navigate = (event) => {
    if (event.target.tagName !== 'H4') return;
    const ThreadToDisplay = event.target.innerText
    const clickedThread = threads.find(thread => thread.title === ThreadToDisplay)
    setSelectedThread(clickedThread)
  }


//// RENDER:
  return (
    <div>

      <header>
      <h1>jsbb</h1>
      <Notification message={errorMessage} />
      {user === null ?
        loginForm() :
        <div>
        <p>{user.username} logged in <button onClick={handleLogout}>logout</button></p>
        </div>
      }
      </header>

      <main>
        <div id="allThreads" onClick={navigate}>
          {showThreadForm()}
          {threadList()}
        </div>

          <Thread
            thread={selectedThread} 
            deletePost={deletePost}
            addPost={addPost}
            newPost={newPost}
            handlePostChange={handlePostChange}
          />







          {/* <h2>PREVIOUS EFFORT</h2>
          {postList()}
          <PostForm 
            onSubmit={addPost}
            value={newPost}
            handleChange={handlePostChange}/> */}
        </main>
        <footer>
          <p>jsbb population 0</p>
        </footer>
    </div>
  )
}

export default App 