import React, { useState } from 'react'

const CreateBlog = ({addBlog}) => {
 

  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>title: <input  value={title} onChange={({ target }) => setTitle(target.value)} /></div>
        <div>author: <input value={author} onChange={({ target }) => setAuthor(target.value)} /></div>
        <div>url: <input  value={url} onChange={({ target }) => setUrl(target.value)} /></div>
        <button type="submit" >create</button>
      </form>
    </div>
  )
}

export default CreateBlog