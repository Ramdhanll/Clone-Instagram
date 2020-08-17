import React, {useState, useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'
import axios from 'axios';
import {UserContext} from '../../App'


function SignIn() {
  const history = useHistory()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const {state, dispatch} = useContext(UserContext)

  const PostData = () => {
    if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
      return M.toast({html: 'Invalid email', classes:"#c62828 red darken-3"}) 
    }
    axios.post("http://localhost:5000/signin", {
      email, password
    })
    .then((result) => {
      localStorage.setItem("token", result.data.token)
      localStorage.setItem("user", JSON.stringify(result.data.user))
      dispatch({type:"USER", payload:result.data.user})
      M.toast({html: "Signin Success", classes:"#43a047 green darken-1"}) 
      history.push('/')
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
          <input 
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
          type="submit">
            Login
          </button>
        </form>
        <h5>
          <Link to="/signup">Dont have an account ?</Link>
        </h5>
      </div>
    </div>
  )
}

export default SignIn
