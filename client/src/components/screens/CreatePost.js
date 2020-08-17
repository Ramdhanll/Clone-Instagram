import React, {useState, useEffect} from 'react'
import axios from 'axios';
import {useHistory} from 'react-router-dom'
import M from 'materialize-css'

function CreatePost() {
  const [caption, setCaption] = useState("")
  const [image, setImage] = useState("")
  const [url, setUrl] = useState("")
  const history = useHistory()
  
  useEffect(() => {
    if (url) {
      axios.post('/posts', {
        caption, photo: url
      },{
        headers : {
          'Authorization' : `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then((result) => {
        M.toast({html: "Created Post Success", classes:"#43a047 green darken-1"}) 
        history.push('/')
      }).catch((err) => {
        console.log(err)
        M.toast({html: err.response.data.error, classes:"#c62828 red darken-3"}) 
      })
    }
  }, [url])

  const postDetails = () => {
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

  return (
    <div className="card input-field"
    style={{
      margin:"30px auto",
      maxWidth:"500px",
      padding:"20px",
      textAlign:"center"
    }}
    >
      <input type="text" 
        placeholder="caption"
        value={caption} 
        onChange={(e) => setCaption(e.target.value)} 
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
      <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => postDetails()}>
          Submit Post
        </button>
    </div>
  )
}

export default CreatePost
