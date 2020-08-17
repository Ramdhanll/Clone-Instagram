import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios';
import moment from 'moment'
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'

function Home() {
  const [posts, setPosts] = useState([])
  const {state, dispatch} = useContext(UserContext)

  useEffect(() => {
    axios.get('/posts', {
      headers : {
        'Authorization' : `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then((result) => {
      setPosts(result.data.posts)
    }).catch((err) => {
      console.log(err)
    });
  }, [])

  const likePost = (postId) => {
    axios.put('/like', {postId}, {
      headers : {
        'Authorization' : `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then((result) => {
      const newData = posts.map(item => {
        if (item._id === result.data._id) {
          return result.data
        } else {
          return item
        }
      })
      setPosts(newData)
    }).catch((err) => {
      console.log(err);
    });
  }

  const unlikePost = (postId) => {
    axios.put('/unlike', {postId}, {
      headers : {
        'Authorization' : `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then((result) => {
      const newData = posts.map(item => {
        if (item._id === result.data._id) {
          return result.data
        } else {
          return item
        }
      })
      setPosts(newData)
    }).catch((err) => {
      console.log(err);
    });
  }

  const makeComment = (text, postId) => {
    axios.put('/comment', {text, postId}, {
      headers : {
        'Authorization' : `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then((result) => {
      console.log(result.data._id, 'result')
      const newData = posts.map(item => {
        if (item._id === result.data._id) { 
          return result.data // jika item._id pada post sama dengan result.data._id maka ganti item.id dengan data pada result.data
        } else {
          return item
        }
      })
      setPosts(newData)
    }).catch((err) => {
      console.log(err)
    });
  }

  const destroyPost = (postId) => {
    axios.delete(`/posts/${postId}`, {
      headers : {
        'Authorization' : `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then((result) => {
      const newData = posts.filter(item => {
        return item._id !== result.data._id
      })

      setPosts(newData)
    }).catch((err) => {
      console.log(err)
    });
  }

  const destroyComment = (postId, commentId) => {
    axios.put('/posts/comment', {
      postId, commentId
    }, {
      headers : {
        'Authorization' : `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then((result) => {
      const newData = posts.map(item => {
        if (item._id === result.data._id) {
          return result.data
        } else {
          return item
        }
      })
      setPosts(newData)
    }).catch((err) => {
      console.log(err)
    });
  }

  return (
    <div className="home">
      {
        posts.map((item, index) => {
          return (
            <div className="card home-card" key={index}>
              <h5 style={{padding:"10px"}}> <Link to={state._id === item.postedBy._id ? `profile` : `profile/${item.postedBy._id}`}>{item.postedBy.name}</Link> 
                {
                  item.postedBy._id === state._id && 
                  <i className="material-icons" 
                      style={{float:"right"}}
                      onClick={() => destroyPost(item._id)}>
                        delete
                  </i>
                }
              </h5>
              <div className="card-image">
                <img src={item.photo} />
              </div>
              <div className="card-content">
                <i className="material-icons" style={{color:"red"}}>favorite</i>
                {
                  item.likes.includes(state._id) ?
                    <i className="material-icons" onClick={() => unlikePost(item._id)}>thumb_down</i> 
                    :
                    <i className="material-icons" onClick={() => likePost(item._id)}>thumb_up</i>
                }
                <h6>{item.likes.length} Likes</h6>
                <h6>{item.caption}</h6>
                {
                  item.comments.map((record) => {
                    return (
                      <h6 key={record._id}>
                        <span style={{fontWeight:"bold"}}>{record.postedBy.name}</span> {record.text}
                        {
                          record.postedBy._id === state._id &&
                          <i className="material-icons" 
                            style={{float:"right"}}
                            onClick={() => destroyComment(item._id, record._id)}>
                              delete
                        </i>
                        }
                      </h6>
                    )
                  })
                }
                <form onSubmit={(e) => {
                  e.preventDefault()
                  makeComment(e.target[0].value, item._id)
                  e.target[0].value = ""
                }}>
                  <input type="text" placeholder="add a comment" />
                </form>
                <p className="postedDate">{moment(item.created_at).format('LLL')}</p>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default Home
