import React,{useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../App'

function Navbar() {
  const {state, dispatch} = useContext(UserContext)
  const history = useHistory()
  const renderList = () => {
    if(state) {
      return [
        <li key="1"><Link to="/profile">Profile</Link></li>,
        <li  key="2"><Link to="/create">Create Post</Link></li>,
        <li  key="3">
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
  return (
    <nav style={{position:'sticky', top:'0', zIndex:"999"}}>
      <div className="nav-wrapper white">
        <Link to={state?'/' : '/signin'} className="brand-logo left">instagram</Link>
        <ul id="nav-mobile" className="right">
          {renderList()}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
