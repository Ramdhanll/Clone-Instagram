import React, {useState, useContext} from 'react'
import {Link, useHistory, useParams} from 'react-router-dom'
import M from 'materialize-css'
import axios from 'axios';
import {UserContext} from '../../App'


function NewPassword() {
  const history = useHistory()
  const [password, setPassword] = useState("")
  const {token} = useParams()

  const PostData = () => {
    axios.post("/new-password", {
      password, token
    })
    .then((result) => {
      M.toast({html: result.data.message, classes:"#43a047 green darken-1"}) 
      history.push('/signin')
    })
    .catch((err) => {
      if (err.response.data.error) {
        M.toast({html: err.response.data.error, classes:"#c62828 red darken-3"}) 
      }
    });
  }
  return (
    <div className="myCard">
      <div className="card auth-card input-field">
        <h2 className="brand-logo">Instagram</h2>
        <form onSubmit={e => {e.preventDefault(); PostData()}}>
          <input 
          type="password"
          placeholder="enter a new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
          type="submit">
            Update Password
          </button>
        </form>
      </div>
    </div>
  )
}

export default NewPassword
