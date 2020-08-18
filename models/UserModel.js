const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
  name : {
    type : String,
    require : true
  },
  email : {
    type : String,
    required : true
  },
  password : {
    type : String,
    required : true
  },
  resetToken : String,
  expireToken : Date,
  photo : {
    type : String,
    default : 'https://res.cloudinary.com/dzehd6loy/image/upload/v1597651172/noimahe_doplgp.png'
  },
  followers : [{
    type : ObjectId,
    ref : "User"
  }],
  following : [{
    type : ObjectId,
    ref : "User"
  }],
})

const User = mongoose.model('User', userSchema)
module.exports = User