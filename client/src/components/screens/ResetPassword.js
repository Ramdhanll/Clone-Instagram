import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'
import M from 'materialize-css'
import axios from 'axios';


function ResetPassword() {
  const history = useHistory()
  const [email, setEmail] = useState("")

  const PostData = () => {
    if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
      return M.toast({html: 'Invalid email', classes:"#c62828 red darken-3"}) 
    }
    axios.post("/reset-password", {
      email
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
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
          type="submit">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
