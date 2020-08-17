const Post = require('../models/PostModel')


const index = (req, res) => {
  const posts = Post.find({})
    // .populate({path : 'postedBy', model : 'User'}) opsi 1
    .populate('postedBy',"_id name") // opsi 2 | parameter kedua untuk menselect hanya field id dan name saja
    .populate('comments.postedBy',"_id name") // opsi 2 | parameter kedua untuk menselect hanya field id dan name saja
    .sort({'created_at' : -1})
    .then((posts) => {
      res.json({posts})
    }).catch((err) => {
      console.log(err)
    });
}

const subscribePost = (req, res) => {
  const posts = Post.find({"postedBy" : { $in : [req.user.following, req.user._id]}}) // ambil data post berdasarkan postedBy yang didalamnya ada data following
    // .populate({path : 'postedBy', model : 'User'}) opsi 1
    .populate('postedBy',"_id name") // opsi 2 | parameter kedua untuk menselect hanya field id dan name saja
    .populate('comments.postedBy',"_id name") // opsi 2 | parameter kedua untuk menselect hanya field id dan name saja
    .sort({'created_at' : -1})
    .then((posts) => {
      res.json({posts})
    }).catch((err) => {
      console.log(err)
    });
}

const store = (req, res) => {
  const {caption, photo} = req.body
  if(!caption || !photo) {
    return res.status(422).json({error: "Please add all the fields"})
  }

  req.user.password = undefined

  const post = new Post({
    caption,
    photo, 
    postedBy : req.user
  })

  post.save()
    .then((result) => {
      res.json({post : result})
    }).catch((err) => {
      console.log(err)
    });
}

const mypost = (req, res) => {
  Post.find({postedBy:req.user._id})
    .populate('postedBy', '_id name')
    .then((mypost) => {
      res.json({mypost})
    }).catch((err) => {
      console.log(err)
    });
}

const like = (req, res) => {
  Post.findByIdAndUpdate(req.body.postId, { // cari post sesuai id nya
    $push : {likes : req.user._id}          // update properties likes dengan id user
  }, {
    new : true
  })
  .populate('postedBy',"_id name") // poplate field comment.postedBy dan hanya ambil _id dan name
  .populate('comments.postedBy',"_id name") // poplate field comment.postedBy dan hanya ambil _id dan name
  .exec((err, result) => {
    if(err) {
      return res.status(422).json({error : err})
    } else {
      res.json(result)
    }
  })
}

const unlike = (req, res) => {
  Post.findByIdAndUpdate(req.body.postId, {
    $pull : {likes: req.user._id}
  }, {
    new:true // You should set the new option to true to return the document after update was applied.
  })
  .populate('postedBy',"_id name") // poplate field comment.postedBy dan hanya ambil _id dan name
  .populate('comments.postedBy',"_id name") // poplate field comment.postedBy dan hanya ambil _id dan name
  .exec((err, result) => {
    if(err) {
      return res.status(422).json({error : err})
    } else {
      res.json(result)
    }
  })
}

const comment = (req, res) => {
  const comment = {
    text : req.body.text,
    postedBy : req.user._id
  }
  Post.findByIdAndUpdate(req.body.postId, {
    $push : {comments : comment}
  }, {
    new : true
  })
  .populate('postedBy',"_id name") // poplate field comment.postedBy dan hanya ambil _id dan name
  .populate('comments.postedBy',"_id name") // poplate field comment.postedBy dan hanya ambil _id dan name
  .exec((err, result) => {
    if(err) {
      return res.status(422).json({error : err})
    } else {
      res.json(result)
    }
  })
}

const destroy = (req, res) => {
  Post.findOne({_id : req.params.postId})
  .populate("postedBy", "_id")
  .exec((err, post) => {
    if(err || !post) {
      return res.status(422).json({error:err})
    }
    if(post.postedBy._id.toString() === req.user._id.toString()) {
      post.remove()
      .then((result) => {
        res.json(result)
      }).catch((err) => {
        console.log(err)
      });
    }
  })
}

const destroyComment = (req, res) => {
  Post.findByIdAndUpdate(req.body.postId, {
    $pull : {comments : {_id : req.body.commentId}}
  }, {
    new : true
  })
  .populate('postedBy',"_id name") // poplate field comment.postedBy dan hanya ambil _id dan name
  .populate('comments.postedBy',"_id name") // poplate field comment.postedBy dan hanya ambil _id dan name
  .exec((err, result) => {
    if(err) {
      return res.status(422).json({error : err})
    } else {
      res.json(result)
    }
  })
}

module.exports = {
  index,
  store,
  mypost,
  like,
  unlike,
  comment,
  destroy,
  destroyComment,
  subscribePost
}