import React, {useState, useEffect} from 'react'
import {Link, useHistory} from 'react-router-dom'
import axios from 'axios'
import M from 'materialize-css'

function SignUp() {
  const history = useHistory()
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [image, setImage] = useState("")
  const [url, setUrl] = useState(undefined) // diset undifined supaya jika url kosong, pas masuk ke database valuenya default dari schema post yang key photo

  useEffect(() => {
    if(url){
      uploadFields()
    }
  }, [url])

  const uploadImage = () => {
    const data = new FormData()

    data.append("file", image)
    data.append('upload_preset', 'insta-clone') // upload to cloudinary
    data.append("cloud_name", "dzehd6loy")
    axios.post("https://api.cloudinary.com/v1_1/dzehd6loy/image/upload", data)
      .then((result) => {
        setUrl(result.data.url)
      }).catch((err) => {
        console.log(err)
      });
  }

  const uploadFields = () => {
    if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
      return M.toast({html: 'Invalid email', classes:"#c62828 red darken-3"}) 
    }
    axios.post("/signup", {
      name,email, password, photo:url
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

  const PostData = () => {
    if (image) {
      uploadImage()
    } else {
      uploadFields()
    }
  }

  return (
    <div className="myCard">
      <div className="card auth-card input-field">
        <h2 className="brand-logo">Instagram</h2>
        <input 
        type="text"
        placeholder="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        />
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
        <div className="file-field input-field">
          <div className="btn #64b5f6 blue darken-1">
            <span>Upload Image</span>
            <input type="file" onChange={e => setImage(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>

        <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
        onClick={PostData}>
          SignUP
        </button>
        <h5>
          <Link to="/signin">Already have an account ?</Link>
        </h5>
      </div>
    </div>
  )
}

export default SignUp
