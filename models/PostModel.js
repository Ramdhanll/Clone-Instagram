const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const postSchema = mongoose.Schema({
  caption : {
    type : String,
    required : true
  },
  photo : {
    type : String,
    required : true
  },
  likes : [
    {
      type : ObjectId,
      ref : "User"
    }
  ],
  comments : [
    {
      text : String,
      postedBy : {
        type : ObjectId,
        ref : "User"
      },
    }
  ],
  postedBy : {
    type : ObjectId,
    ref : "User" // pastikan huruf nya sama dengan collection user
  }
}, {
  timestamps: { createdAt: 'created_at' }
})

const Post = mongoose.model("Post", postSchema)
module.exports = Post