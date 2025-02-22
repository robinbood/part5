import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import CreateBlog from './components//CreateBlog'
import Togglable from './components/Togglable'



const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  const createBlogRef = useRef()


  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedUser')
    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  useEffect(() => {

    blogService.getAll().then(blogs => {

      setBlogs(blogs)
    })

  }, [])



  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    }
    catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }

  }

  const createBlog = async (newObject) => {
    event.preventDefault()
  createBlogRef.current.toggleVisibility()

    try {
      const newBlog = await blogService.create(newObject)
      console.log(":", newBlog);
      setBlogs(blogs.concat(newBlog))
    } catch (exception) {
      setErrorMessage("faaailed to do so")
    }
  }

  const logout = () => { window.localStorage.removeItem('loggedUser'), setUser(null) }
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

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} />

      {!user && loginForm()}
      {user && <div><h3><strong>{user.name}</strong> logged in</h3><button onClick={logout}>logout</button></div>}


      {user && <div>
        <Togglable buttonLabel="new Blog" ref={createBlogRef}>
          <CreateBlog addBlog={createBlog} />
        </Togglable>
      </div>}


      {user && <div>{blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}</div>
      }


    </div>
  )
}

export default App