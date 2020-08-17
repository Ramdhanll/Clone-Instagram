const express = require('express')
const mongoose = require('mongoose')
const { route } = require('../routes/user')
const Post = mongoose.model("Post")
const User = mongoose.model("User")

const show = (req, res) => {
  User.findOne({_id : req.params.id})
  .select("-password") // ambil data kecuali password
  .then((user) => {
    Post.find({postedBy : req.params.id})
    .populate("postedBy", "_id name") // poplate pada properties postedBy dan hanya ambil _id dan name
    .exec((err, posts) => {
      if(err) {
        return res.status(404).json({error : err})
      }
      res.json({user, posts})
    })
  })
  .catch((err) => {
    return res.status(404).json({error : "User not found"})
  });
}

const follow = (req, res) => {
  User.findByIdAndUpdate(req.body.followId, {
    $push : {followers : req.user._id}
  }, {
    new : true
  }, (err, result) => {
    if (err) return res.status(404).json({error : err})

    User.findByIdAndUpdate(req.user._id, {
      $push : {following : req.body.followId}
    }, {
      new : true
    })
    .select("-password") // select kecuali password
    .then((result) => {
      res.json(result)
    }).catch((err) => {
      res.status(404).json({error : err})
    });
    
  })
}

const unfollow = (req, res) => {
  User.findByIdAndUpdate(req.body.unfollowId, {
    $pull : {followers : req.user._id}
  }, {
    new : true
  }, (err, result) => {
    if (err) return res.status(404).json({error : err})

    User.findByIdAndUpdate(req.user._id, {
      $pull : {following : req.body.unfollowId}
    }, {
      new : true
    })
    .select("-password") // select kecuali password
    .then((result) => {
      res.json(result)
    }).catch((err) => {
      res.status(404).json({error : err})
    });
    
  })
}

const updatePhoto = (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    $set : { photo: req.body.photo}
  },{
    new : true 
  }, 
    (err, result) => {
      if(err) return res.status(404).json({error : "Photo cannot post"})
      res.json(result)
    })
}

module.exports = {
  show,
  follow,
  unfollow,
  updatePhoto
}