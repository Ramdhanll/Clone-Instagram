import React,{useEffect, useState, useContext} from 'react'
import axios from 'axios'
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'

function UserProfile() {
  const [userProfile, setUserProfile] = useState(null)
  // const [showFollow, setShowFollow] = useState(true)
  const {state, dispatch} = useContext(UserContext)
  const {userId} = useParams() // ambil dari params userId

  useEffect(() => {
    axios.get(`/user/${userId}`, {
      headers : {
        'Authorization' : `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => result.data)
    .then((result) => {
      setUserProfile(result)
    }).catch((err) => {
      console.log(err)
    });
  },[])

  const follow = () => {
    axios.put('/follow', {
      followId : userId
    }, {
      headers : {
        'Authorization' : `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => result.data)
    .then((result) => {
      setUserProfile(prevState => {
        return {
          ...prevState,
          user : {
                  ...prevState.user,
                  followers : [...prevState.user.followers, result._id]
                }
        }
      })
      dispatch({type:"UPDATE", payload : {following : result.following, followers : result.followers} })
      localStorage.setItem("user", JSON.stringify(result))
      // setShowFollow(false)
    }).catch((err) => {
      console.log(err)
    });
  }

  const unfollow = () => {
    axios.put('/unfollow', {
      unfollowId : userId
    }, {
      headers : {
        'Authorization' : `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => result.data)
    .then((result) => {
      console.log(result)
      setUserProfile(prevState => {
        const newFollowers = prevState.user.followers.filter(item => item != result._id)
        return {
          ...prevState,
          user : {
                  ...prevState.user,
                  followers : newFollowers
                }
        }
      })
      dispatch({type:"UPDATE", payload : {following : result.following, followers : result.followers} })
      localStorage.setItem("user", JSON.stringify(result))
    }).catch((err) => {
      console.log(err)
    });
  }

  return (
    <>
    {userProfile ? 
      <div style={{maxWidth:"700px", margin:"0px auto"}}>
      <div style={{
              display:"flex",
              justifyContent:"space-around",
              margin:"18px 0px",
              borderBottom:"1px solid grey"
      }}>
        <div>
          <img style={{width:"160px", height:"160px", borderRadius:"80px"}}
          alt="profile"
          src={userProfile.user.photo}
          />
        </div>
        <div>
          <h4>{userProfile.user.name}</h4>
          <h5>{userProfile.user.email}</h5>
          <div style={{display:"flex", justifyContent:"space-between", width:"108%"}}>
            <h6>{userProfile.posts.length} posts</h6>
            <h6>{userProfile.user.followers.length} followers</h6>
            <h6>{userProfile.user.following.length} following</h6>
          </div>
          {
            !userProfile.user.followers.includes(state._id) ? 
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
            style={{margin : '10px'}}
            onClick={() => follow()}>
              follow
            </button>
            :
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
            style={{margin : '10px'}}
            onClick={() => unfollow()}>
              unfollow
            </button>
          }
        </div>
      </div>
    
      <div className="gallery">
        {
          userProfile.posts.map(item => {
            return(
              <img className="item" src={item.photo} key={item._id} alt={item._id}/>
            )
          })
        }
      </div>
    </div>
    : <h2>Loading ...!</h2>}
    </>
  )
}

export default UserProfile
