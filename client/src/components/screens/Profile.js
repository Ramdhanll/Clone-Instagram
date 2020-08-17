import React,{useEffect, useState, useContext} from 'react'
import axios from 'axios'
import {UserContext} from '../../App'

function Profile() {
  const [mypics, setMypics] = useState([])
  const {state, dispatch} = useContext(UserContext)
  const [image, setImage] = useState("")

  useEffect(() => {
    axios.get('/myposts', {
      headers : {
        'Authorization' : `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then((result) => {
      setMypics(result.data.mypost)
    }).catch((err) => {
      console.log(err)
    });
  },[])

  const updatePhoto = (file) => {
    setImage(file)
  }

  useEffect(() => {
    if(image) {
      const data = new FormData()

      data.append("file", image)
      data.append('upload_preset', 'insta-clone') // upload to cloudinary
      data.append("cloud_name", "dzehd6loy")
      axios.post("https://api.cloudinary.com/v1_1/dzehd6loy/image/upload", data)
      .then((result) => {
        axios.put('/user/update-photo', {
          photo:result.data.url
        }, {
          headers : {
            'Authorization' : `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then((result) => {
          console.log(result, 'bah')
          localStorage.setItem("user", JSON.stringify({...state, photo:result.data.photo}))
          dispatch({type: "UPDATE_PHOTO", payload : {photo : result.data.photo}})
        }).catch((err) => {
          console.log(err, 'jah')
        });
      }).catch((err) => {
        console.log(err)
      });
    }
  }, [image])
  return (
    <div style={{maxWidth:"700px", margin:"0px auto"}}>
      <div style={{
          margin:"18px 0px",
          borderBottom:"1px solid grey"
        }}>
    
        <div style={{
          display:"flex",
          justifyContent:"space-around",
        }}>
          <div>
            <img style={{width:"160px", height:"160px", borderRadius:"80px"}}
            alt="profile"
            src={state ? state.photo : ''}
            />
          </div>
          <div>
            <h4>{state ? state.name : 'loading...'}</h4>
            <div style={{display:"flex", justifyContent:"space-between", width:"108%"}}>
              <h6>{mypics.length} posts</h6>
              <h6>{state ? state.followers.length : '0'} followers</h6>
              <h6>{state ? state.following.length : '0'} following</h6>
            </div>
          </div>
        </div>
        
        <div className="file-field input-field" style={{margin : "10px"}}>
          <div className="btn #64b5f6 blue darken-1">
            <span>Update Image</span>
            <input type="file" onChange={e => updatePhoto(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>

      </div>
      <div className="gallery">
        {
          mypics.map(item => {
            return(
              <img className="item" src={item.photo} key={item._id} alt={item._id}/>
            )
          })
        }
      </div>
    </div>
  )
}

export default Profile
