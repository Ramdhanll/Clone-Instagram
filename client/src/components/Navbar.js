import React,{useContext, useRef, useEffect, useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'
import axios from 'axios'

function Navbar() {
  const {state, dispatch} = useContext(UserContext)
  const history = useHistory()
  const modalSearch = useRef(null)
  const [search, setSearch] = useState("")
  const timeoutRef = useRef(null);
  const [userSearch, setuserSearch] = useState([])

  useEffect(() => {
    M.Modal.init(modalSearch.current)
  }, [])

  const renderList = () => {
    if(state) {
      return [
        <li key="0"><i data-target="modalSearch" className="large material-icons modal-trigger" style={{color: 'black'}}>search</i></li>,
        <li key="1"><Link to="/profile">Profile</Link></li>,
        <li key="2"><Link to="/create">Create Post</Link></li>,
        <li key="3">
          <button className="btn #c62828 red darken-3"
          onClick={() => {
            localStorage.clear()
            dispatch({type : "CLEAR"})
            history.push('/signin')
          }}>
            Logout
          </button>
        </li>
      ] 
    } else {
      return [
        <li  key="4"><Link to="/signin">Signin</Link></li>,
        <li  key="5"><Link to="/signup">Signup</Link></li>,
      ]
    }
  }

  const fetchUsers = (query) => {
    setSearch(query)
    axios.post('/search', {
      query
    }, {
      headers : {
        'Authorization' : `Bearer ${localStorage.getItem('token')}`
      }
    }).then(result => result.data)
    .then((result) => {
      setuserSearch(result.user)
    }).catch((err) => {
      
    });
  }

  useEffect(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(()=> {
      timeoutRef.current = null;
      if (search !== "") {
        fetchUsers(search)
      } else {
        setuserSearch([])
      }
    },500);
  }, [search])


  return (
    <nav style={{position:'sticky', top:'0', zIndex:"999"}}>
      <div className="nav-wrapper white">
        <Link to={state?'/' : '/signin'} className="brand-logo left">instagram</Link>
        <ul id="nav-mobile" className="right">
          {renderList()}
        </ul>
      </div>

      <div id="modalSearch" className="modal" ref={modalSearch} style={{color: 'black'}}>
        <div className="modal-content">
        <input 
          type="text"
          placeholder="search users"
          value={search}
          onChange={(e) => fetchUsers(e.target.value)}
          onChange={(e) => setSearch(e.target.value)}
          />
          <ul className="collection" style={{display: 'flex', flexDirection:'column', cursor: 'pointer'}}>
            {
              userSearch.map(item => {
                return <Link replace 
                key={item._id}  
                to={state._id === item._id ? `profile` : `/profile/${item._id}`}
                className="collection-item"
                onClick={() => {
                  setSearch('')
                  M.Modal.getInstance(modalSearch.current).close()
                }}
                >{item.name}</Link>
                // return  <li className="collection-item"><Link key={item._id}  to={`/profile/${item._id}`}>{item.name}</Link></li>
              })
            }
          </ul>
        </div>
        <div className="modal-footer">
          <button className="modal-close waves-effect waves-green btn-flat" onClick={() => setSearch('')}>Close</button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
