import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom'
import  { useField } from './hooks'

const Notification = ({ notification }) => {
  const style = {
    color: 'rgb(73, 159, 84)',
    background: 'rgb(227, 227, 227)',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginTop: 20
  }
  return (
    <div style={style}>
      {notification}
    </div>
  )
}

const Menu = () => {
  const padding_for_links = {
    paddingRight: 5,
  }
  return (
    <div>
      <h2>Software anecdotes</h2>
      <Link style={padding_for_links} to="/">anecdotes</Link>
      <Link style={padding_for_links} to="/create">create new</Link>
      <Link style={padding_for_links} to="/about">about</Link>
    </div>
  )
}

const Anecdote = ({ anecdote }) => {
  return (
    <div>
      <h2><i>"{anecdote.content}"</i> by {anecdote.author}</h2>
      has {anecdote.votes} votes
      <p></p>
      for more info see <a href={anecdote.info}>{anecdote.info}</a>
    </div>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote =>
        <li key={anecdote.id}> <Link to={`/${anecdote.id}`}>{anecdote.content}</Link></li>
      )}
    </ul>
  </div>
)

const About = () => (
  <div>
    <h2>About anecdote app</h2>

    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => {
  const padding = {
    paddingTop: 20
  }
  return (
  <div style={padding}>
    <hr></hr>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.
    <br></br>
    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
  )
}

const CreateNew = (props) => {
  const navigate = useNavigate()

  const content = useField('text')
  const author = useField('text')
  const url = useField('text')
  
  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content: content.value,
      author: author.value,
      info: url.value,
      votes: 0
    })
    navigate('/')
  }

  const handleReset = (e) => {
    content.reset()
    author.reset()
    url.reset()
  }
  return (
    <div>
      <h2>create a new anecdote</h2>

      <form onSubmit={handleSubmit}>
        <div>
          content { } <input type={content.type} value={content.value} onChange={content.onChange}  />
        </div>
        <div>
          author { } <input type={author.type} value={author.value} onChange={author.onChange}  />
        </div>
        <div>
          url for more info { } <input type={url.type} value={url.value} onChange={url.onChange}  />
        </div>
        <button type="submit">create</button> { } <button type="button" onClick={handleReset}>reset</button>
      </form>
    </div>
  )
}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))

    setNotification(`A new anecdote created: "${anecdote.content}"`)
    setTimeout(() => {
      setNotification('')
    }, 2000)
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))}

  const match = useMatch('/:id')

  const anecdote = match 
    ? anecdotes.find(anecdote => anecdote.id === Number(match.params.id))
    : null

  return (
    <div>
      <Menu />
        <Routes>
          <Route path="/:id" element={<Anecdote anecdote={anecdote} />} />
          <Route path="/" element={
            <div>
              {notification && <Notification notification={notification} />}
              <AnecdoteList anecdotes={anecdotes} />
            </div>
          } />
          <Route path="/create" element={<CreateNew addNew={addNew} />} />
          <Route path="/about" element={<About />} />
        </Routes>
      <Footer />
    </div>
  )
}

export default App
